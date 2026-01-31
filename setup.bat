@echo off
REM ============================================
REM Frappe Healthcare Docker Setup Script
REM ============================================

echo ============================================
echo Frappe Healthcare Docker Setup
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

echo [1/5] Docker is running...
echo.

REM Pull required images
echo [2/5] Pulling Docker images (this may take a while)...
docker-compose pull
if %errorlevel% neq 0 (
    echo ERROR: Failed to pull images!
    pause
    exit /b 1
)
echo.

REM Start the containers
echo [3/5] Starting containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start containers!
    pause
    exit /b 1
)
echo.

REM Wait for site creation
echo [4/5] Waiting for ERPNext site to be created (this may take 3-5 minutes)...
echo Please wait...

:wait_loop
timeout /t 30 /nobreak >nul
docker-compose logs create-site 2>&1 | findstr /C:"Site frontend installed" >nul
if %errorlevel% neq 0 (
    docker-compose logs create-site 2>&1 | findstr /C:"Error" >nul
    if %errorlevel% equ 0 (
        echo ERROR: Site creation failed! Check logs with: docker-compose logs create-site
        pause
        exit /b 1
    )
    goto wait_loop
)

echo.
echo [5/5] Site created successfully!
echo.
echo ============================================
echo SETUP COMPLETE!
echo ============================================
echo.
echo Access ERPNext at: http://localhost:8080
echo.
echo Default Credentials:
echo   Username: Administrator
echo   Password: admin
echo.
echo To install Healthcare module, run:
echo   install-healthcare.bat
echo.
pause
