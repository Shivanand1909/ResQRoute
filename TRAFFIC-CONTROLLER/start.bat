@echo off
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   ResQRoute Traffic Controller - Quick Start    ║
echo ╚══════════════════════════════════════════════════╝
echo.

echo [Step 1/3] Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ Installation failed!
        echo Please run: npm install
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo [Step 2/3] Checking configuration...
if not exist .env (
    echo ⚠️  .env file not found, using defaults
    echo Creating .env from .env.example...
    copy .env.example .env
)
echo ✅ Configuration ready

echo.
echo [Step 3/3] Starting server...
echo.
echo ═══════════════════════════════════════════════════
echo   🚦 Traffic Controller Starting...
echo ═══════════════════════════════════════════════════
echo.

node src/server.js

if errorlevel 1 (
    echo.
    echo ❌ Server failed to start!
    echo Check the error messages above.
    pause
)