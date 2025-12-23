@echo off
echo ==========================================
echo CS2 Polymarket Parser - Quick Install
echo ==========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

:: Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully!
echo.

:: Build project
echo Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Installation completed successfully!
echo ==========================================
echo.
echo To run the example:
echo   npm run dev
echo.
echo Or:
echo   npm test
echo.
pause
