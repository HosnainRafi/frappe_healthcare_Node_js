@echo off
REM ============================================
REM Stop and Cleanup Script
REM ============================================

echo ============================================
echo Stopping Frappe Healthcare Docker
echo ============================================
echo.

echo Stopping containers...
docker-compose down
echo.

echo Containers stopped!
echo.
echo Note: Data is preserved in Docker volumes.
echo To completely remove all data, run: cleanup-all.bat
echo.
pause
