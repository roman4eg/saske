@echo off
echo ==========================================
echo Updating CS2 Polymarket Parser
echo ==========================================
echo.

echo Fetching latest changes from Git...
git pull
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git pull failed
    pause
    exit /b 1
)

echo.
echo Installing/updating dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed
    pause
    exit /b 1
)

echo.
echo Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Update completed successfully!
echo ==========================================
echo.
echo You can now run:
echo   run.bat  - to start the parser
echo   test.bat - to test API connection
echo.
pause
