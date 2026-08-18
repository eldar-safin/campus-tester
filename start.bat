@echo off
setlocal

docker compose up -d --build --wait
if errorlevel 1 exit /b %errorlevel%

echo.
echo Jenkins: http://localhost:8080

endlocal
