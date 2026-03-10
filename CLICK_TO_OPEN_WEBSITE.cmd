@echo off
setlocal

REM ==============================================
REM CLICK_TO_OPEN_WEBSITE.cmd
REM Double-click to start the site and open browser
REM ==============================================

cd /d "%~dp0"

if not exist "package.json" (
  echo [ERROR] package.json not found in: %~dp0
  pause
  exit /b 1
)

set "NPM_EXE="
if exist "E:\Program Files\nodejs\npm.cmd" (
  set "NPM_EXE=E:\Program Files\nodejs\npm.cmd"
) else (
  where npm.cmd >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] npm was not found. Please install Node.js first.
    pause
    exit /b 1
  )
  set "NPM_EXE=npm.cmd"
)

if not exist "node_modules" (
  echo [INFO] Installing dependencies for first run...
  call "%NPM_EXE%" install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo [INFO] Starting dev server...
start "" powershell -NoLogo -NoExit -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '%~dp0'; & '%NPM_EXE%' run dev"

echo [INFO] Waiting for http://localhost:5173 ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$url='http://localhost:5173';$deadline=(Get-Date).AddMinutes(2);while((Get-Date)-lt $deadline){try{$r=Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2;if($r.StatusCode -ge 200){Start-Process $url;exit 0}}catch{};Start-Sleep -Seconds 1};Start-Process $url"

exit /b 0
