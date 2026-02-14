@echo off
REM ============================================
REM View Logs Script
REM ============================================

echo ============================================
echo Frappe Healthcare Docker Logs
echo ============================================
echo.
echo 1. All services
echo 2. Backend only
echo 3. Frontend only
echo 4. Database only
echo 5. Create-site (for setup issues)
echo 6. Exit
echo.
set /p choice="Select option (1-6): "

if "%choice%"=="1" docker-compose logs -f
if "%choice%"=="2" docker-compose logs -f backend
if "%choice%"=="3" docker-compose logs -f frontend
if "%choice%"=="4" docker-compose logs -f db
if "%choice%"=="5" docker-compose logs -f create-site
if "%choice%"=="6" exit /b 0

pause
