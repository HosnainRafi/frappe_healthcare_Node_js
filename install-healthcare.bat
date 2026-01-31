@echo off
REM ============================================
REM Install Healthcare Module Script
REM ============================================

echo ============================================
echo Installing Frappe Healthcare Module
echo ============================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if containers are running
docker-compose ps | findstr "backend" >nul
if %errorlevel% neq 0 (
    echo ERROR: Containers are not running!
    echo Please run setup.bat first.
    pause
    exit /b 1
)

echo [1/4] Getting Healthcare app from repository...
docker-compose exec backend bench get-app healthcare --branch version-15
if %errorlevel% neq 0 (
    echo.
    echo Trying alternative: getting healthcare from frappe repository...
    docker-compose exec backend bench get-app https://github.com/frappe/healthcare.git --branch version-15
    if %errorlevel% neq 0 (
        echo.
        echo Trying with develop branch...
        docker-compose exec backend bench get-app https://github.com/frappe/healthcare.git --branch develop
        if %errorlevel% neq 0 (
            echo ERROR: Failed to get Healthcare app!
            pause
            exit /b 1
        )
    )
)
echo.

echo [2/4] Installing Healthcare app on site...
docker-compose exec backend bench --site frontend install-app healthcare
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Healthcare app!
    pause
    exit /b 1
)
echo.

echo [3/4] Running database migrations...
docker-compose exec backend bench --site frontend migrate
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migrations!
    pause
    exit /b 1
)
echo.

echo [4/4] Clearing cache...
docker-compose exec backend bench --site frontend clear-cache
docker-compose exec backend bench --site frontend clear-website-cache
echo.

echo ============================================
echo HEALTHCARE MODULE INSTALLED SUCCESSFULLY!
echo ============================================
echo.
echo Access ERPNext Healthcare at: http://localhost:8080
echo.
echo Login with:
echo   Username: Administrator
echo   Password: admin
echo.
echo After login, search for "Healthcare Settings" to configure.
echo.
pause
