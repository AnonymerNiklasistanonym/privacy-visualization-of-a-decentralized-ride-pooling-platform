#!/usr/bin/env pwsh

Param (
	[string]$JobNameSimulation = "Simulation",
	[string]$JobNameWebApp = "WebApp",
	[int]$PortSimulation = 2222,
	[int]$PortWebapp = 3000,
	[bool]$StartJobs = $true
)

# Stop script on error
$ErrorActionPreference = "Stop"

Write-Output "Stop jobs..."
foreach ($job in Get-Job $JobNameSimulation)
{
	Stop-Job $job
	Remove-Job $job
}
foreach ($job in Get-Job $JobNameWebApp)
{
	Stop-Job $job
	Remove-Job $job
}

# Early exit in case no jobs should be started
if (!$StartJobs) {
	Exit 0
}

# Start Simulation
$SimulationJob = Start-Job -Name $JobNameSimulation -ScriptBlock {
	Set-Location $using:PWD
	Set-Location "simulation"
	npm install
	npm run compile
	npm run dist
	npm run start -- --port $using:PortSimulation
}

# Start WebApp
$WebAppJob = Start-Job -Name $JobNameWebApp -ScriptBlock {
	Set-Location $using:PWD
	Set-Location (Join-Path -Path "webapp" -ChildPath "quick-demo")
	npm install
	npm run dev
}

Write-Output "Start jobs..."
Write-Host ($SimulationJob, $WebAppJob | Format-Table -Property "id", "Name", "State", "Command" | Out-String)

# Open relevant web pages
Start-Sleep -Seconds 30
Start-Process "http://localhost:$PortSimulation/"
Start-Process "http://localhost:$PortWebapp/"

# Reset CLI location
Set-Location $PSScriptRoot
Exit 0
