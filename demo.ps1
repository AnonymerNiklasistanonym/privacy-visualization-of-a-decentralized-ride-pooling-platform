#!/usr/bin/env pwsh

Set-Location simulation
npm install
npm run compile
npm run dist
Start-Job -Name Simulation -ScriptBlock { Set-Location $using:PWD; npm run start -- --port 2222 }
Set-Location ..
Set-Location (Join-Path -Path "webapp" -ChildPath "quick-demo")
npm install
npm run dev
