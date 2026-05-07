$ErrorActionPreference = "Continue"

function Write-Check {
    param(
        [string]$Name,
        [bool]$Ok,
        [string]$Detail
    )

    $status = if ($Ok) { "OK" } else { "MISSING" }
    Write-Output "$status - $Name - $Detail"
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$npmCommand = Get-Command npm -ErrorAction SilentlyContinue
$packageJsonExists = Test-Path -LiteralPath "package.json"
$appJsonExists = Test-Path -LiteralPath "app.json"
$nodeModulesExists = Test-Path -LiteralPath "node_modules"

Write-Output "Language Lyrics Lab environment check"
Write-Output "Repository: $repoRoot"
Write-Output ""

Write-Check -Name "package.json" -Ok $packageJsonExists -Detail "Project manifest"
Write-Check -Name "app.json" -Ok $appJsonExists -Detail "Expo config"
Write-Check -Name "node" -Ok ($null -ne $nodeCommand) -Detail $(if ($nodeCommand) { & node -v } else { "Node.js not found in PATH" })
Write-Check -Name "npm" -Ok ($null -ne $npmCommand) -Detail $(if ($npmCommand) { & npm -v } else { "npm not found in PATH" })
Write-Check -Name "node_modules" -Ok $nodeModulesExists -Detail $(if ($nodeModulesExists) { "Dependencies already installed" } else { "Run npm install after npm is available" })

Write-Output ""
Write-Output "This script does not install, download, or modify system configuration."
