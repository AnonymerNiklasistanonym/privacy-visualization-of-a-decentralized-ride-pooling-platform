#!/usr/bin/env pwsh

Param (
	[PSCustomObject]$JobPathfinder = [PSCustomObject]@{
		Name = "Pathfinder"
		Port = 3010
		Dir = Join-Path -Path $PSScriptRoot -ChildPath "pathfinder"
	},
	[PSCustomObject]$JobSimulation = [PSCustomObject]@{
		Name = "Simulation"
		Port = 3020
		Dir = Join-Path -Path $PSScriptRoot -ChildPath "simulation"
	},
	[PSCustomObject]$JobVisualization = [PSCustomObject]@{
		Name = "Visualization"
		Port = 3000
		Dir = Join-Path -Path $PSScriptRoot -ChildPath "visualization"
	},
	[string]$JobNamePathfinder = "Pathfinder",
	[string]$JobNameSimulation = "Simulation",
	[string]$JobNameVisualization = "Visualization",
	[int]$PortPathfinder = 3010,
	[int]$PortSimulation = 3020,
	[int]$PortWebapp = 3000,
	[bool]$Verbose = $false,
	[bool]$StartJobs = $true,
	[string]$BaseUrl = "http://localhost"
)

# Stop script on error
$ErrorActionPreference = "Stop"

# Variables
$Ports = @($JobSimulation.Port, $JobVisualization.Port)

# Stop previous jobs
Write-Output "Stop jobs..."
foreach ($job in Get-Job -Name $JobNamePathfinder, $JobNameSimulation, $JobNameVisualization -ErrorAction SilentlyContinue)
{
	Stop-Job $job
	Remove-Job $job
}
if (!$StartJobs) {
	# Early exit in case no jobs should be started
	Exit 0
}

function WriteJobProgress
{
	Param (
		[object]$Job
	)

	$jobProgress = $Job.ChildJobs[0].Progress
	if($jobProgress -ne $null)
	{
		$jobProgressCurrent = $jobProgress[$jobProgress.Count - 1];
		Write-Progress -Id $Job.Id -Activity $Job.Name -Status $jobProgressCurrent.Activity -PercentComplete $jobProgressCurrent.PercentComplete;
	}
}

function RunWriteJobProgress
{
	Param (
		[object[]]$Jobs
	)

	while(($Jobs | Where-Object {$_.State -ne "Completed"}).Count -gt 0)
	{
		foreach ($job in $Jobs)
		{
			WriteJobProgress($job)
		}
		Start-Sleep -Milliseconds 10
	}
	foreach ($job in $Jobs)
	{
		Write-Progress -Id $Job.Id -Completed
	}
}

# Start prepare jobs
Write-Output "Start prepare jobs..."
$PathfinderJobPrepare = Start-Job -Name $JobPathfinder.Name -WorkingDirectory $JobPathfinder.Dir -ScriptBlock {
	Write-Progress -Activity "finished" -PercentComplete 100;
}
$SimulationJobPrepare = Start-Job -Name $JobSimulation.Name -WorkingDirectory $JobSimulation.Dir -ScriptBlock {
	Write-Progress -Activity "install" -PercentComplete 0;
	npm install
	Write-Progress -Activity "compile" -PercentComplete 33;
	npm run compile
	Write-Progress -Activity "dist" -PercentComplete 66;
	npm run dist
	Write-Progress -Activity "finished" -PercentComplete 100;
}
$VisualizationJobPrepare = Start-Job -Name $JobVisualization.Name -WorkingDirectory $JobVisualization.Dir -ScriptBlock {
	Write-Progress -Activity "install" -PercentComplete 0;
	npm install
	Write-Progress -Activity "finished" -PercentComplete 100;
}
if ($Verbose) {
	$PathfinderJobPrepare, $SimulationJobPrepare, $VisualizationJobPrepare | Format-Table
}
RunWriteJobProgress($PathfinderJobPrepare, $SimulationJobPrepare, $VisualizationJobPrepare)

Write-Output "Wait for prepare jobs..."
Wait-Job -Job $PathfinderJobPrepare, $SimulationJobPrepare, $VisualizationJobPrepare -Timeout 60 | Out-Null

if ($Verbose) {
	foreach ($job in $PathfinderJobPrepare, $SimulationJobPrepare, $VisualizationJobPrepare)
	{
		Write-Output "Job $job.Name Output:"
		Write-Output (Receive-Job -Job $job)
	}
}

# Start jobs
Write-Output "Start jobs..."
$PathfinderJob = Start-Job -Name $JobPathfinder.Name -WorkingDirectory $JobPathfinder.Dir -ScriptBlock {
	python3 -m flask --app "shortest_path_server" run --host="0.0.0.0" --port $using:PortPathfinder | Tee-Object -FilePath dev.log
}
$SimulationJob = Start-Job -Name $JobSimulation.Name -WorkingDirectory $JobSimulation.Dir -ScriptBlock {
	npm run start -- --port $using:PortSimulation | Tee-Object -FilePath dev.log
}
$VisualizationJob = Start-Job -Name $JobVisualization.Name -WorkingDirectory $JobVisualization.Dir -ScriptBlock {
	npm run dev | Tee-Object -FilePath dev.log
}
if ($Verbose) {
	$PathfinderJob, $SimulationJob, $VisualizationJob | Format-Table
}

# Open relevant web pages
Start-Sleep -Seconds 5
Write-Output "Open URLs..."
foreach ($port in $Ports)
{
	Start-Process "${BaseUrl}:$port/"
}

Write-Output "Wait for jobs..."
Wait-Job -Job $PathfinderJob, $SimulationJob, $VisualizationJob | Out-Null
