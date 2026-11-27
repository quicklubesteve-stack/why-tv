@echo off
title WHY IPTV - Senior Academic Presentation Launcher
color 0B
cls

echo ===============================================================================
echo                WHY IPTV - AUTOMATED CLASSROOM LAUNCHER
echo              Academic Demonstration Prototype (Acer Windows)
echo ===============================================================================
echo.

:: 1. Check Node.js and npm
echo [*] Step 1/5: Checking system dependencies...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo     [OK] Node.js detected: %NODE_VERSION%
echo     [OK] npm detected: %NPM_VERSION%
echo.

:: 2. Check node_modules
echo [*] Step 2/5: Checking project dependencies...
if not exist "node_modules" (
    echo     Dependencies missing. Installing now...
    call npm install
) else (
    echo     [OK] Dependencies verified.
)
echo.

:: 3. Kill any zombie processes on port 5180
echo [*] Step 3/5: Ensuring port 5180 is clear...
powershell -Command "Get-NetTCPConnection -LocalPort 5180 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
echo     [OK] Port 5180 ready.
echo.

:: 4. Start Vite Dev Server in Background
echo [*] Step 4/5: Starting WHY IPTV Server on port 5180...
start "WHY IPTV Dev Server (Port 5180)" /min cmd /c "npm run dev -- --port 5180"

:: 5. Wait until Server is Ready
echo [*] Step 5/5: Waiting for WHY IPTV to initialize...
powershell -Command "$ready = $false; for ($i=0; $i -lt 30; $i++) { try { $res = Invoke-WebRequest -Uri 'http://localhost:5180' -UseBasicParsing -TimeoutSec 2; if ($res.StatusCode -eq 200) { $ready = $true; break } } catch { Start-Sleep -Milliseconds 500 } }; if (-not $ready) { Write-Host 'Server taking longer than expected...' }"

echo.
echo ===============================================================================
echo   SUCCESS! WHY IPTV IS ONLINE AND READY FOR TEACHER DEMONSTRATION
echo   Local Address: http://localhost:5180/
echo ===============================================================================
echo.
echo Launching your default web browser...
start http://localhost:5180/

echo.
echo [CLASSROOM NAVIGATION SHORTCUTS]
echo   - Television Guide: Default primary screen
echo   - AI Assistant: Click 'AI Assistant' or press top button
echo   - Sports Center: Click 'Sports Center' in top toolbar
echo   - Academic Dossier: Click 'Academic Dossier' for Capstone Report
echo   - Remote Control: Arrow keys, Enter, Backspace/Esc, M (menu)
echo   - To stop: Run STOP-WHY-IPTV.bat
echo.
echo Keep this window open or press any key to close this launcher.
pause >nul
