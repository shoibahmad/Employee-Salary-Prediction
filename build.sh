#!/bin/bash

# Build Script for Render Monolith
# Handles both Backend (Python) and Frontend (React)

echo "--- Building Backend ---"
pip install -r backend/requirements.txt

echo "--- Building Frontend ---"
cd frontend
# Install and Build React
npm install
npm run build
cd ..

echo "--- Build Complete ---"
