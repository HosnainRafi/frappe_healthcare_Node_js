@echo off
echo Starting Frappe Healthcare Docker Project...
echo.

cd /d "%~dp0"

REM Start all services
docker-compose up -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:3000
echo   Frappe:    http://localhost:8080
echo.
echo   To stop: docker-compose down
echo   To view logs: docker-compose logs -f
echo ========================================
