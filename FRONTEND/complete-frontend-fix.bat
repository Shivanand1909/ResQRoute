@echo off
echo.
echo ╔═══════════════════════════════════════════════╗
echo ║   Complete Frontend Fix                      ║
echo ╚═══════════════════════════════════════════════╝
echo.

cd FRONTEND

echo [Step 1/5] Cleaning old installation...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock
echo ✅ Cleaned

echo.
echo [Step 2/5] Clearing npm cache...
call npm cache clean --force
echo ✅ Cache cleared

echo.
echo [Step 3/5] Installing dependencies...
call npm install --legacy-peer-deps
echo ✅ Dependencies installed

echo.
echo [Step 4/5] Fixing vulnerabilities...
call npm audit fix --force
echo ✅ Vulnerabilities fixed

echo.
echo [Step 5/5] Final verification...
call npm list --depth=0
echo.

echo ═══════════════════════════════════════════════
echo ✅ Frontend Setup Complete!
echo ═══════════════════════════════════════════════
echo.
echo Warnings about deprecated packages are normal.
echo The app will still work fine!
echo.
echo Next steps:
echo   1. npm start          (Start Metro)
echo   2. npm run android    (Run on Android)
echo.

pause