@echo off
REM ============================================
REM System Health Check
REM ============================================

echo.
echo =====================================================
echo Hospital Management System - Health Check
echo =====================================================
echo.

echo Checking services...
echo.

echo [1/6] Frappe Backend:
curl -s -o nul -w "  Status: %%{http_code}\n" http://localhost:8080

echo.
echo [2/6] Node.js API:
curl -s http://localhost:3000/health

echo.
echo [3/6] PostgreSQL:
docker-compose exec -T postgres pg_isready -U hospital_user -d hospital_db

echo.
echo [4/6] MariaDB:
docker-compose exec -T db mysqladmin ping -h localhost -ppassword=123

echo.
echo [5/6] Redis (Node.js):
docker-compose exec -T redis-nodejs redis-cli ping

echo.
echo [6/6] Docker Container Status:
docker-compose ps

echo.
echo =====================================================
echo Health Check Complete
echo =====================================================
echo.
pause
