@echo off
REM ============================================
REM Backup Script
REM ============================================

echo ============================================
echo Frappe Healthcare Backup
echo ============================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    pause
    exit /b 1
)

REM Create backup directory
set backup_dir=backups\%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%
set backup_dir=%backup_dir: =0%
mkdir "%backup_dir%" 2>nul

echo Creating backup in: %backup_dir%
echo.

echo [1/2] Creating site backup...
docker-compose exec backend bench --site frontend backup --with-files
echo.

echo [2/2] Copying backup files...
docker cp frappe-healthcare-docker-backend-1:/home/frappe/frappe-bench/sites/frontend/private/backups "%backup_dir%"
echo.

echo ============================================
echo BACKUP COMPLETE!
echo ============================================
echo.
echo Backup location: %backup_dir%
echo.
pause
