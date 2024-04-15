#!/usr/bin/env pwsh

Param (
	[string]$VenvDir = (Join-Path -Path $PSScriptRoot -ChildPath "venv_test"),
	[string]$RemoveVenvDir = $false
)

if ($RemoveVenvDir) {
    Remove-Item $VenvDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Output "Test-Path -Path $VenvDir" (Test-Path -Path $VenvDir) $VenvDir
if (Test-Path -Path $VenvDir -IsValid) {
    Write-host "Path $VenvDir is Valid!" -f Green
} else {
    Write-host "Path $VenvDir is Invalid!" -f Red
}
if (Test-Path -Path $VenvDir) {
    Write-Host "The file $VenvDir exists" -f Green
} else {
    Write-Host "The file $VenvDir does not exist" -f Yellow
}

if (Test-Path -Path $VenvDir) {
    Write-Output "Install packages"
    python -m pip install networkx osmnx notebook folium matplotlib mapclassify
    jupyter notebook
} else {
    Write-Output "Setup venv"
    python -m venv $VenvDir
}
