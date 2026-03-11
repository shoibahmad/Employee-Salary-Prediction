#!/bin/bash

echo "========================================"
echo "Employee Salary Prediction System"
echo "Model Training Setup"
echo "========================================"
echo ""

echo "Step 1: Creating models directory..."
mkdir -p backend/models
echo "Done!"
echo ""

echo "Step 2: Generating synthetic dataset (100,000 employees)..."
echo "This may take 1-2 minutes..."
python3 backend/generate_dataset.py
if [ $? -ne 0 ]; then
    echo "Error generating dataset!"
    exit 1
fi
echo ""

echo "Step 3: Training machine learning models..."
echo "This may take 2-3 minutes..."
python3 backend/train_models.py
if [ $? -ne 0 ]; then
    echo "Error training models!"
    exit 1
fi
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Models have been trained and saved."
echo "You can now start the backend server."
echo ""
