@echo off
title Stop WHY IPTV Server
color 0C
cls

echo ===============================================================================
echo                      STOPPING WHY IPTV SERVICES
echo ===============================================================================
echo.

echo [*] Terminating web server processes on port 5180...
powershell -Command "Get-NetTCPConnection -LocalPort 5180 -ErrorAction SilentlyContinue | ForEach-Object { $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue; if ($proc) { Write-Host '  Killing process:' $proc.ProcessName '(PID:' $proc.Id ')'; Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } }"

echo.
echo [OK] WHY IPTV dev server safely terminated. Port 5180 is now released.
echo.
pause
