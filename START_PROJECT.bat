@echo off
echo ========================================
echo Employee Salary Prediction System
echo Starting Application
echo ========================================
echo.

echo Checking if models are trained...
if not exist "backend\models\random_forest_model.pkl" (
    echo Models not found! Running setup...
    call setup_models.bat
)

echo.
echo ========================================
echo Starting Backend Server (Flask)
echo ========================================
echo Backend will run on: http://localhost:5000
echo.
start "Backend Server" cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo Installing Frontend Dependencies
echo ========================================
cd frontend
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
)

echo.
echo ========================================
echo Starting Frontend Server (React)
echo ========================================
echo Frontend will run on: http://localhost:3000
echo.
echo The browser will open automatically!
echo.
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to view this window, or close to continue...
pause
