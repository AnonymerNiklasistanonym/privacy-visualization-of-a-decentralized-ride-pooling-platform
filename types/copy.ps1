#!/usr/bin/env pwsh

Param (
	[string]$SourceDirGlobalTypes = (Join-Path -Path $PSScriptRoot -ChildPath "globals"),
	[string]$DestinationFileHeaderContent = "// This file was copied from the global types directory, do not change!",
	[string[]]$DestinationDirs = @(
		(Join-Path -Path $PSScriptRoot -ChildPath ".." | Join-Path -ChildPath "simulation" | Join-Path -ChildPath "src" | Join-Path -ChildPath "types" | Join-Path -ChildPath "globals"),
		(Join-Path -Path $PSScriptRoot -ChildPath ".." | Join-Path -ChildPath "webapp" | Join-Path -ChildPath "src" | Join-Path -ChildPath "types" | Join-Path -ChildPath "globals")
	)
)


# Stop script on error
$ErrorActionPreference = "Stop"

Write-Output "Copy global types..."
foreach ($DestinationDir in $DestinationDirs)
{
	Write-Output "Copy global types from '$SourceDirGlobalTypes' to '$DestinationDir'"
	Remove-Item $DestinationDir -Recurse -Force
	New-Item $DestinationDir -ItemType Directory -Force
	$Files = Get-ChildItem -Recurse $SourceDirGlobalTypes -Include *.ts -ErrorAction SilentlyContinue -Force
	foreach ($File in $Files)
	{
		Write-Output $File.FullName
		$OutputPath = Join-Path -Path $DestinationDir -ChildPath (Resolve-Path -Path $File -Relative -RelativeBasePath $SourceDirGlobalTypes)
		$OutputContent = $DestinationFileHeaderContent + "`n`n" + (Get-Content -Path $File -Encoding UTF8 -Raw)
		#Write-Output "Copy global type file '$File' to '$OutputPath'" $OutputContent
		Set-Content $OutputPath -NoNewline -Encoding UTF8 -Value $OutputContent
	}
}
