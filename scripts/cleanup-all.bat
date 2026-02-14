@echo off
REM ============================================
REM Complete Cleanup Script (REMOVES ALL DATA!)
REM ============================================

echo ============================================
echo WARNING: COMPLETE CLEANUP
echo ============================================
echo.
echo This will:
echo - Stop all containers
echo - Remove all containers
echo - DELETE ALL DATA (database, files, etc.)
echo.
set /p confirm="Are you sure? Type 'yes' to continue: "

if /i not "%confirm%"=="yes" (
    echo Cancelled.
    pause
    exit /b 0
)

echo.
echo Stopping and removing containers...
docker-compose down -v --remove-orphans
echo.

echo Removing images (optional - saves disk space)...
set /p removeimages="Remove Docker images too? (y/n): "
if /i "%removeimages%"=="y" (
    docker-compose down --rmi all
    echo Images removed.
)
echo.

echo ============================================
echo CLEANUP COMPLETE!
echo ============================================
echo.
echo To set up again, run: setup.bat
echo.
pause
