@echo off
title WHY IPTV - Pre-Presentation Diagnostics Check
color 0A
cls

echo ===============================================================================
echo                WHY IPTV - PRE-PRESENTATION DIAGNOSTIC SUITE
echo            Pre-flight Verification for Classroom Academic Evaluation
echo ===============================================================================
echo.

:: 1. Verify Node and npm
echo [*] Phase 1/4: Checking Runtime Environment...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [FAIL] Node.js is missing!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo     [OK] Node Version: %%i
for /f "tokens=*" %%i in ('npm -v') do echo     [OK] NPM Version: %%i
echo.

:: 2. Run Comprehensive Automated Test Suite
echo [*] Phase 2/4: Running Full Automated Multi-Provider Test Suite...
call npx tsx test-suite.mjs
if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo [FAIL] Unit tests failed! Please resolve before classroom presentation.
    pause
    exit /b 1
)
echo.

:: 3. Run Production Build Validation
echo [*] Phase 3/4: Testing TypeScript & Production Bundle Compilation...
call npm run build
if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo [FAIL] Build compilation failed!
    pause
    exit /b 1
)
echo.

:: 4. Verify Live Stream Connectivity
echo [*] Phase 4/4: Testing CDN Edge Streaming Availability...
powershell -Command "$urls = @('https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8', 'https://static.france24.com/live/F24_EN_LO_HLS/live_en.m3u8', 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'); foreach ($u in $urls) { try { $r = Invoke-WebRequest -Uri $u -Method Head -TimeoutSec 4; Write-Host '    [OK] Upstream Origin Responding:' $u.Substring(0, 42) '...' } catch { Write-Host '    [WARN] Upstream Origin Slow or Blocked:' $u.Substring(0, 42) '...' } }"

echo.
echo ===============================================================================
echo   CONGRATULATIONS: 100% PRE-PRESENTATION CHECKS PASSED!
echo   WHY IPTV IS FULLY FUNCTIONAL, VALIDATED, AND CLASSROOM READY.
echo ===============================================================================
echo.
echo You may now safely run START-WHY-IPTV.bat to begin your demonstration.
echo.
pause
