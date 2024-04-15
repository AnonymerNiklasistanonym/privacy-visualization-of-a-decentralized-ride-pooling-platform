#!/usr/bin/env pwsh

# Copy the global types to the projects that use them with an additional header

Param (
	[string]$SourceDir = (Join-Path -Path $PSScriptRoot -ChildPath "typescript"),
	[string]$DestinationFileHeaderContent = "// This file was copied from the global types directory, do not change!",
	[string[]]$DestinationDirs = @(
		(Join-Path -Path $PSScriptRoot -ChildPath ".." | Join-Path -ChildPath "simulation" | Join-Path -ChildPath "src" | Join-Path -ChildPath "globals"),
		(Join-Path -Path $PSScriptRoot -ChildPath ".." | Join-Path -ChildPath "visualization" | Join-Path -ChildPath "src" | Join-Path -ChildPath "globals")
	)
)


# Stop script on error
$ErrorActionPreference = "Stop"

$DestinationDirs | ForEach-Object -Parallel {
	$DestinationDir = $_
	Write-Output "Copy files from '$using:SourceDir' to '$DestinationDir'"
	Remove-Item $DestinationDir -Recurse -Force -ErrorAction SilentlyContinue
	New-Item $DestinationDir -ItemType Directory -Force | Out-Null
	$Files = Get-ChildItem -Recurse $using:SourceDir -Include "*.ts" -ErrorAction SilentlyContinue -Force | Where-Object FullName -notmatch (@('node_modules') -join "|")
	$SourceDir = $using:SourceDir
	$DestinationFileHeaderContent = $using:DestinationFileHeaderContent
	$Files | ForEach-Object -Parallel {
		$File = $_
		$RelativeFilePath = Resolve-Path -Path $File -Relative -RelativeBasePath $using:SourceDir
		$OutputPath = Join-Path -Path $using:DestinationDir -ChildPath $RelativeFilePath
		$OutputContent = $using:DestinationFileHeaderContent + "`n`n" + (Get-Content -Path $File -Encoding UTF8 -Raw)
		Write-Output "Copy '$RelativeFilePath' to '$using:DestinationDir'"
		New-Item (Split-Path -Parent $OutputPath) -ItemType Directory -Force | Out-Null
		Set-Content $OutputPath -NoNewline -Encoding UTF8 -Value $OutputContent
	}
}
