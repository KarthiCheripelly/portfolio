# Pushes this site to GitHub and prepares GitHub Pages deployment.
# Prerequisites (once): run `gh auth login` in PowerShell and complete browser login.

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

$env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')

function Test-GhAuth {
  $prev = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  $null = gh auth status 2>&1
  $ok = ($LASTEXITCODE -eq 0)
  $ErrorActionPreference = $prev
  return $ok
}

if (-not (Test-GhAuth)) {
  Write-Host ''
  Write-Host 'GitHub CLI is not logged in.' -ForegroundColor Yellow
  Write-Host 'Run this once, then run this script again:' -ForegroundColor Yellow
  Write-Host '  gh auth login' -ForegroundColor Cyan
  Write-Host ''
  exit 1
}

$ownerRepo = 'KarthiCheripelly/portfolio'
gh repo view $ownerRepo 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Creating repository $ownerRepo ..."
  gh repo create $ownerRepo --public --description 'Personal website'
}

Write-Host 'Pushing to GitHub ...'
git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Push failed. Try: gh auth setup-git' -ForegroundColor Red
  exit 1
}

Write-Host ''
Write-Host 'Push succeeded. Enable Pages (one-time):' -ForegroundColor Green
Write-Host '  https://github.com/KarthiCheripelly/portfolio/settings/pages'
Write-Host '  Build and deployment -> Source: GitHub Actions'
Write-Host ''
Write-Host 'After the workflow turns green, your site:' -ForegroundColor Green
Write-Host '  https://karthicheripelly.github.io/portfolio/'
Write-Host ''
