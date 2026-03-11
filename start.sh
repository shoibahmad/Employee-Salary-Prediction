#!/bin/bash

# Employee Salary Prediction System
# Unified Startup Script for Local and Production (Render)

echo "========================================"
echo "Employee Salary Prediction System"
echo "Starting Application..."
echo "========================================"

# Determine if we are on Render
IF_RENDER=${RENDER:-false}

if [ "$IF_RENDER" = "true" ]; then
    echo "Production Mode (Render)"
    echo "Starting Production Server (Backend + Frontend)..."
    # In monolith mode, Gunicorn / Flask serves the frontend build
    gunicorn --chdir backend app:app --bind 0.0.0.0:$PORT
else
    echo "Local Development Mode"
    
    # Checking if models are trained
    if [ ! -f "backend/models/random_forest_model.pkl" ]; then
        echo "Models not found! Running setup..."
        bash setup_models.sh
    fi

    # Start backend
    echo "Starting Backend (Flask)..."
    cd backend
    python3 app.py &
    BACKEND_PID=$!
    cd ..

    # Start frontend
    echo "Starting Frontend (React)..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..

    echo "========================================"
    echo "Processes started: Backend ($BACKEND_PID), Frontend ($FRONTEND_PID)"
    echo "========================================"

    # Handle cleanup on exit
    trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

    wait
fi
