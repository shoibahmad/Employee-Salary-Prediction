@echo off
echo ========================================
echo Employee Salary Prediction System
echo Model Training Setup
echo ========================================
echo.

echo Step 1: Creating models directory...
if not exist "backend\models" mkdir backend\models
echo Done!
echo.

echo Step 2: Generating synthetic dataset (100,000 employees)...
echo This may take 1-2 minutes...
python backend/generate_dataset.py
if %errorlevel% neq 0 (
    echo Error generating dataset!
    pause
    exit /b 1
)
echo.

echo Step 3: Training machine learning models...
echo This may take 2-3 minutes...
python backend/train_models.py
if %errorlevel% neq 0 (
    echo Error training models!
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Models have been trained and saved.
echo You can now start the backend server.
echo.
pause
