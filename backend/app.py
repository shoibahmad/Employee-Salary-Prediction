from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
import json
from flask import send_from_directory

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)


# Store employees and predictions
employees_db = []
predictions_history = []

# Load trained models and encoders
# Get the directory where this script is located
import os
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(SCRIPT_DIR, 'models')

try:
    model_based_predictor = joblib.load(os.path.join(MODEL_DIR, 'random_forest_model.pkl'))
    ai_based_predictor = joblib.load(os.path.join(MODEL_DIR, 'gradient_boosting_model.pkl'))
    
    # Load label encoders
    le_education = joblib.load(os.path.join(MODEL_DIR, 'label_encoder_education.pkl'))
    le_department = joblib.load(os.path.join(MODEL_DIR, 'label_encoder_department.pkl'))
    le_position = joblib.load(os.path.join(MODEL_DIR, 'label_encoder_position.pkl'))
    le_location = joblib.load(os.path.join(MODEL_DIR, 'label_encoder_location.pkl'))
    
    # Load metadata
    with open(os.path.join(MODEL_DIR, 'model_metadata.json'), 'r') as f:
        model_metadata = json.load(f)
    
    print("✓ Models loaded successfully!")
    print(f"  Random Forest Accuracy: {model_metadata['random_forest']['accuracy']:.2f}%")
    print(f"  Gradient Boosting Accuracy: {model_metadata['gradient_boosting']['accuracy']:.2f}%")
    print(f"  Training Dataset Size: {model_metadata['dataset_size']:,} employees")
    
except Exception as e:
    print(f"⚠ Warning: Could not load trained models: {e}")
    print("Please run: python backend/generate_dataset.py && python backend/train_models.py")
    
    # Fallback to basic encoders
    le_education = None
    le_department = None
    le_position = None
    le_location = None
    model_metadata = None

# Get available options from encoders
def get_available_options():
    if le_education is None:
        return {
            'departments': ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'],
            'positions': ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director'],
            'education_levels': ['Bachelor', 'Master', 'PhD'],
            'locations': ['New York', 'San Francisco', 'Austin']
        }
    
    return {
        'departments': le_department.classes_.tolist(),
        'positions': le_position.classes_.tolist(),
        'education_levels': le_education.classes_.tolist(),
        'locations': le_location.classes_.tolist()
    }

@app.route('/api/predict/model', methods=['POST'])
def predict_model_based():
    try:
        data = request.json
        
        # Encode categorical variables
        edu_encoded = le_education.transform([data['education']])[0]
        dept_encoded = le_department.transform([data['department']])[0]
        pos_encoded = le_position.transform([data['position']])[0]
        loc_encoded = le_location.transform([data.get('location', 'New York')])[0]
        
        # Prepare features in the same order as training
        features = np.array([[
            data['age'],
            data['years_experience'],
            edu_encoded,
            dept_encoded,
            pos_encoded,
            loc_encoded,
            data['performance_score'],
            data.get('technical_skills', 6.0),
            data.get('soft_skills', 6.5),
            data.get('certifications', 0),
            data.get('projects_completed', data['years_experience'] * 2),
            data.get('work_hours_per_week', 40),
            data.get('remote_work_percentage', 50)
        ]])
        
        prediction = model_based_predictor.predict(features)[0]
        
        # Calculate confidence based on model metadata
        confidence = model_metadata['random_forest']['r2_score'] if model_metadata else 0.90
        
        result = {
            'predicted_salary': round(prediction, 2),
            'model_type': 'Random Forest (Model-Based)',
            'confidence': round(confidence, 2),
            'model_accuracy': f"{model_metadata['random_forest']['accuracy']:.2f}%" if model_metadata else "90%"
        }
        
        predictions_history.append({**data, **result})
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/predict/ai', methods=['POST'])
def predict_ai_based():
    try:
        data = request.json
        
        # Encode categorical variables
        edu_encoded = le_education.transform([data['education']])[0]
        dept_encoded = le_department.transform([data['department']])[0]
        pos_encoded = le_position.transform([data['position']])[0]
        loc_encoded = le_location.transform([data.get('location', 'New York')])[0]
        
        # Prepare features in the same order as training
        features = np.array([[
            data['age'],
            data['years_experience'],
            edu_encoded,
            dept_encoded,
            pos_encoded,
            loc_encoded,
            data['performance_score'],
            data.get('technical_skills', 6.0),
            data.get('soft_skills', 6.5),
            data.get('certifications', 0),
            data.get('projects_completed', data['years_experience'] * 2),
            data.get('work_hours_per_week', 40),
            data.get('remote_work_percentage', 50)
        ]])
        
        prediction = ai_based_predictor.predict(features)[0]
        
        # Calculate confidence based on model metadata
        confidence = model_metadata['gradient_boosting']['r2_score'] if model_metadata else 0.93
        
        result = {
            'predicted_salary': round(prediction, 2),
            'model_type': 'Gradient Boosting (AI-Based)',
            'confidence': round(confidence, 2),
            'model_accuracy': f"{model_metadata['gradient_boosting']['accuracy']:.2f}%" if model_metadata else "93%"
        }
        
        predictions_history.append({**data, **result})
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/employees', methods=['GET'])
def get_employees():
    return jsonify(employees_db)

@app.route('/api/employees', methods=['POST'])
def add_employee():
    try:
        employee = request.json
        employee['id'] = len(employees_db) + 1
        employees_db.append(employee)
        return jsonify(employee), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/predictions/history', methods=['GET'])
def get_predictions_history():
    return jsonify(predictions_history)

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    if not predictions_history:
        return jsonify({
            'total_predictions': 0,
            'avg_salary': 0,
            'department_stats': {},
            'position_stats': {}
        })
    
    df = pd.DataFrame(predictions_history)
    
    analytics = {
        'total_predictions': len(predictions_history),
        'avg_salary': round(df['predicted_salary'].mean(), 2),
        'min_salary': round(df['predicted_salary'].min(), 2),
        'max_salary': round(df['predicted_salary'].max(), 2),
        'department_stats': df.groupby('department')['predicted_salary'].mean().to_dict(),
        'position_stats': df.groupby('position')['predicted_salary'].mean().to_dict()
    }
    
    return jsonify(analytics)

@app.route('/api/options', methods=['GET'])
def get_options():
    return jsonify(get_available_options())

@app.route('/api/model/info', methods=['GET'])
def get_model_info():
    if model_metadata:
        return jsonify(model_metadata)
    return jsonify({'error': 'Model metadata not available'}), 404

# Serve React App
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
