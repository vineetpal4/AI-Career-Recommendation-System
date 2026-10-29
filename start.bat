@echo off
title CareerAI Launcher
echo ========================================================
echo         CareerAI - Starting Full Stack Application
echo ========================================================
echo.

echo [1/2] Starting Flask Backend on http://127.0.0.1:5000 ...
cd /d "%~dp0backend"
start "CareerAI - Flask Backend" cmd /k python app.py

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
cd /d "%~dp0frontend"
start "CareerAI - React Frontend" cmd /k npm run dev

cd /d "%~dp0"

echo.
echo Both servers are launching!
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:5000
echo.
echo NOTE: Keep the two black command prompt windows OPEN while using the app!
echo.
echo Opening browser in 4 seconds...
ping 127.0.0.1 -n 5 >nul
start http://localhost:5173
