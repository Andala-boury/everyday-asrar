# Asrar Everyday - Git Setup Script for PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Asrar Everyday - Git Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Yellow
git init
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Failed to initialize Git repository" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Repository initialized" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Adding all files..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Failed to add files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Files added" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Asrar Everyday - Islamic Numerology App

Features:
- Traditional Abjad calculator with Maghrib rules
- Hadad Summary analysis with element breakdown
- Weekly Life Guidance (Al-Buni tradition)
- Name Destiny & Spiritual Stations
- Compatibility analysis
- Divine Timing with planetary hours
- History & favorites system
- Dark mode support
- Arabic transliteration from Latin text"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Failed to create commit" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Commit created" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Renaming branch to main..." -ForegroundColor Yellow
git branch -M main
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Failed to rename branch" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Branch renamed to main" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/Andala-boury/everyday-asrar.git 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Remote already exists, setting URL..." -ForegroundColor Yellow
    git remote set-url origin https://github.com/Andala-boury/everyday-asrar.git
}
Write-Host "✓ Remote repository added" -ForegroundColor Green

Write-Host ""
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted to authenticate with GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ ERROR: Failed to push to GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "Authentication Required:" -ForegroundColor Yellow
    Write-Host "If this is your first time, you need to authenticate:" -ForegroundColor Yellow
    Write-Host "  Option 1: Use GitHub CLI - Run: gh auth login" -ForegroundColor White
    Write-Host "  Option 2: Personal Access Token" -ForegroundColor White
    Write-Host "    1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "    2. Generate new token (classic)" -ForegroundColor White
    Write-Host "    3. Select 'repo' scope" -ForegroundColor White
    Write-Host "    4. Use token as password when prompted" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SUCCESS! Repository created and pushed to GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository is now available at:" -ForegroundColor Cyan
Write-Host "https://github.com/Andala-boury/everyday-asrar" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Visit the repository URL above" -ForegroundColor White
Write-Host "  2. Add topics/tags: islamic-numerology, abjad, ilm-huruf, nextjs" -ForegroundColor White
Write-Host "  3. Edit repository description" -ForegroundColor White
Write-Host "  4. Enable GitHub Pages if you want to deploy" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
