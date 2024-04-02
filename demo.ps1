#!/usr/bin/env pwsh

cd simulation
npm install
npm run compile
npm run dist
Start-Job -ScriptBlock { npm run start -- --port 2222 }
cd ..
cd (Join-Path -Path "webapp" -ChildPath "quick-demo")
npm install
npm run dev
