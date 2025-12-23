@echo off
echo ==========================================
echo Rebuilding CS2 Polymarket Parser
echo ==========================================
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
echo Rebuild completed successfully!
echo ==========================================
echo.
echo You can now run:
echo   run.bat  - to start the parser
echo   test.bat - to test API connection
echo.
pause
