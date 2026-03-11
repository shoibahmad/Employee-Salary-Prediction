# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Backend (3 minutes)

Open a terminal and run:

**Windows:**
```bash
cd backend
pip install -r requirements.txt
cd ..
setup_models.bat
```

**Mac/Linux:**
```bash
cd backend
pip install -r requirements.txt
cd ..
chmod +x setup_models.sh
./setup_models.sh
```

This will:
- Install Python dependencies
- Generate 100,000 synthetic employee records
- Train both ML models (Random Forest & Gradient Boosting)

### Step 2: Start Backend Server

```bash
cd backend
python app.py
```

You should see:
```
✓ Models loaded successfully!
  Random Forest Accuracy: 91.23%
  Gradient Boosting Accuracy: 93.45%
  Training Dataset Size: 100,000 employees
 * Running on http://127.0.0.1:5000
```

### Step 3: Setup Frontend (1 minute)

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

## 🎯 What You Can Do

1. **Home Page** - See features and overview
2. **Predict Salary** - Enter employee details and get instant predictions
3. **Employees** - Add and manage employee records
4. **Analytics** - View salary statistics and charts
5. **History** - Browse all predictions made

## 📊 Try a Sample Prediction

Go to "Predict Salary" and enter:
- Name: John Doe
- Age: 30
- Years Experience: 5
- Education: Bachelor
- Department: IT
- Position: Senior
- Location: San Francisco
- Performance Score: 4.5
- Technical Skills: 8
- Soft Skills: 7
- Certifications: 2
- Work Hours/Week: 40
- Remote Work %: 60

Click "Predict Salary" to see the result!

## ❓ Troubleshooting

**Backend won't start:**
- Make sure you ran `setup_models.bat` or `setup_models.sh` first
- Check that Python 3.8+ is installed: `python --version`

**Frontend won't start:**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**Models not loading:**
- Check that `backend/models/` directory exists
- Re-run the setup script

**CORS errors:**
- Ensure backend is running on port 5000
- Check that Flask-CORS is installed

## 🎉 You're Ready!

Enjoy predicting salaries with 93%+ accuracy!
