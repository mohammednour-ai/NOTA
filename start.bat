@echo off
echo ========================================
echo  NOTA - Perfume Recommendation
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo.
    echo Please create a .env file with your API keys.
    echo See env-template.txt for reference.
    echo.
    echo Minimum required:
    echo ANTHROPIC_API_KEY=your_key_here
    echo PORT=3000
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo [INFO] Installing dependencies...
    call npm install
)

echo [INFO] Starting server...
echo.
echo Server will start at: http://localhost:3000
echo Press Ctrl+C to stop
echo.

node server.js
