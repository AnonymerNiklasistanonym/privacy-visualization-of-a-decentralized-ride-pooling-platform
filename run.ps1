#!/usr/bin/env pwsh

Param (
	[PSCustomObject]$JobSimulation = [PSCustomObject]@{
		Name = "Simulation"
		Port = 2222
		Dir = Join-Path -Path $PSScriptRoot -ChildPath "simulation"
	},
	[PSCustomObject]$JobVisualization = [PSCustomObject]@{
		Name = "Visualization"
		Port = 3000
		Dir = Join-Path -Path $PSScriptRoot -ChildPath "visualization"
	},
	[string]$JobNameSimulation = "Simulation",
	[string]$JobNameVisualization = "Visualization",
	[int]$PortSimulation = 2222,
	[int]$PortWebapp = 3000,
	[bool]$Verbose = $false,
	[bool]$StartJobs = $true,
	[string]$BaseUrl = "http://localhost"
)

# Stop script on error
$ErrorActionPreference = "Stop"

# Variables
$DirSimulation = Join-Path -Path $PSScriptRoot -ChildPath "simulation"
$DirWebApp = Join-Path -Path $PSScriptRoot -ChildPath "visualization"
$Ports = @($JobSimulation.Port, $JobVisualization.Port)

# Stop previous jobs
Write-Output "Stop jobs..."
foreach ($job in Get-Job -Name $JobNameSimulation, $JobNameVisualization -ErrorAction SilentlyContinue)
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
	$SimulationJobPrepare, $VisualizationJobPrepare | Format-Table
}
RunWriteJobProgress($SimulationJobPrepare, $VisualizationJobPrepare)

Write-Output "Wait for prepare jobs..."
Wait-Job -Job $SimulationJobPrepare, $VisualizationJobPrepare -Timeout 60 | Out-Null

if ($Verbose) {
	foreach ($job in $SimulationJobPrepare, $VisualizationJobPrepare)
	{
		Write-Output "Job $job.Name Output:"
		Write-Output (Receive-Job -Job $job)
	}
}

# Start jobs
Write-Output "Start jobs..."
$SimulationJob = Start-Job -Name $JobNameSimulation -WorkingDirectory $DirSimulation -ScriptBlock {
	npm run start -- --port $using:PortSimulation | Tee-Object -FilePath dev.log
}
$VisualizationJob = Start-Job -Name $JobNameVisualization -WorkingDirectory $DirWebApp -ScriptBlock {
	npm run dev | Tee-Object -FilePath dev.log
}
if ($Verbose) {
	$SimulationJob, $VisualizationJob | Format-Table
}

# Open relevant web pages
Start-Sleep -Seconds 5
Write-Output "Open URLs..."
foreach ($port in $Ports)
{
	Start-Process "${BaseUrl}:$port/"
}

Write-Output "Wait for jobs..."
Wait-Job -Job $SimulationJob, $VisualizationJob | Out-Null
