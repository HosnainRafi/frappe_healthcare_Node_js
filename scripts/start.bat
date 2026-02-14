@echo off
REM ============================================
REM Start Script (After Initial Setup)
REM ============================================

echo ============================================
echo Starting Frappe Healthcare Docker
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

echo Starting containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start containers!
    pause
    exit /b 1
)
echo.

echo Waiting for services to be ready...
timeout /t 30 /nobreak >nul
echo.

echo ============================================
echo CONTAINERS STARTED!
echo ============================================
echo.
echo Access ERPNext Healthcare at: http://localhost:8080
echo.
echo Login with:
echo   Username: Administrator
echo   Password: admin
echo.
pause
