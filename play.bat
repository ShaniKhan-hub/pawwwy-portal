@echo off
rem ----------------------------------------------------------------------------
rem  Pawwwy — one-click local launcher (Windows)
rem
rem  Opens two terminal windows:
rem    1. Portal backend  — Spring Boot on :8090
rem    2. Portal frontend — Vite dev server on :5173
rem
rem  When both are up, open http://localhost:5173 in your browser.
rem  Close the terminal windows to stop the services.
rem
rem  Prerequisites: JDK 17+, Maven, Node.js 20+, npm
rem ----------------------------------------------------------------------------

setlocal

echo.
echo  Pawwwy
echo  ======
echo.

rem ---------- Sanity-check tools are on PATH -----------------------------------

where /q java
if errorlevel 1 (
    echo  ERROR: java is not on PATH. Install JDK 17+ and try again.
    pause
    exit /b 1
)

where /q mvn
if errorlevel 1 (
    echo  ERROR: mvn ^(Maven^) is not on PATH. Install Maven 3.8+ and try again.
    pause
    exit /b 1
)

where /q npm
if errorlevel 1 (
    echo  ERROR: npm is not on PATH. Install Node.js 20+ and try again.
    pause
    exit /b 1
)

rem ---------- Install frontend deps if needed ----------------------------------

if not exist "portal-frontend\node_modules" (
    echo  First run: installing frontend dependencies . . .
    pushd portal-frontend
    call npm install
    popd
    if errorlevel 1 (
        echo  ERROR: npm install failed. Open portal-frontend manually and debug.
        pause
        exit /b 1
    )
    echo.
)

rem ---------- Spawn the two services in their own terminals --------------------

echo  Starting portal backend on http://localhost:8090 . . .
start "Pawwwy backend (:8090)" cmd /k "cd portal-backend && mvn spring-boot:run"

echo  Starting portal frontend on http://localhost:5173 . . .
start "Pawwwy frontend (:5173)" cmd /k "cd portal-frontend && npm run dev"

echo.
echo  Two terminal windows have been opened.
echo  Once both show "ready", open: http://localhost:5173
echo.
echo  Close those windows to stop the services.
echo.

endlocal
