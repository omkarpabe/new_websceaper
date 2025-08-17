@echo off
REM Web Scraper Pro - Windows Setup Script

echo.
echo 🕷️  Web Scraper Pro - Local Setup
echo ==================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js (version 18+) first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

echo.
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

echo.
echo 🚀 Starting Web Scraper Pro...
echo    Server will be available at: http://localhost:5000
echo    Press Ctrl+C to stop the server
echo.

call npm run dev

pause