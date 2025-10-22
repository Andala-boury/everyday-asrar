@echo off
echo ========================================
echo Asrar Everyday - Git Setup Script
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo After installation, restart PowerShell and run this script again.
    pause
    exit /b 1
)

echo Step 1: Initializing Git repository...
git init
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to initialize Git repository
    pause
    exit /b 1
)

echo.
echo Step 2: Adding all files...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit: Asrar Everyday - Islamic Numerology App"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)

echo.
echo Step 4: Renaming branch to main...
git branch -M main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to rename branch
    pause
    exit /b 1
)

echo.
echo Step 5: Adding remote repository...
git remote add origin https://github.com/Andala-boury/everyday-asrar.git
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Remote might already exist, trying to set URL...
    git remote set-url origin https://github.com/Andala-boury/everyday-asrar.git
)

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo You may need to authenticate with GitHub.
    echo If this is your first time, you might need to:
    echo 1. Set up a Personal Access Token
    echo 2. Or use GitHub CLI (gh auth login)
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Repository created and pushed to GitHub
echo ========================================
echo.
echo Your repository is now available at:
echo https://github.com/Andala-boury/everyday-asrar
echo.
pause
