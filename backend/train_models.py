import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(SCRIPT_DIR, 'employee_dataset.csv')
MODEL_DIR = os.path.join(SCRIPT_DIR, 'models')

# Create models directory if it doesn't exist
os.makedirs(MODEL_DIR, exist_ok=True)

print("Loading employee dataset...")
df = pd.read_csv(DATASET_PATH)

print(f"Dataset loaded: {len(df)} employees")
print(f"\nFeatures: {df.columns.tolist()}")

# Prepare features for training
feature_columns = [
    'age', 'years_experience', 'education', 'department', 'position',
    'location', 'performance_score', 'technical_skills', 'soft_skills',
    'certifications', 'projects_completed', 'work_hours_per_week',
    'remote_work_percentage'
]

target = 'base_salary'

# Create label encoders for categorical variables
label_encoders = {}
categorical_columns = ['education', 'department', 'position', 'location']

for col in categorical_columns:
    le = LabelEncoder()
    df[f'{col}_encoded'] = le.fit_transform(df[col])
    label_encoders[col] = le

# Prepare feature matrix
feature_columns_encoded = [
    'age', 'years_experience', 'education_encoded', 'department_encoded',
    'position_encoded', 'location_encoded', 'performance_score',
    'technical_skills', 'soft_skills', 'certifications',
    'projects_completed', 'work_hours_per_week', 'remote_work_percentage'
]

X = df[feature_columns_encoded]
y = df[target]

print(f"\nFeature matrix shape: {X.shape}")
print(f"Target variable shape: {y.shape}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTraining set: {len(X_train)} samples")
print(f"Test set: {len(X_test)} samples")

# Train Random Forest Model (Model-Based)
print("\n" + "="*60)
print("Training Random Forest Model (Model-Based Optimized)...")
print("="*60)

rf_model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    min_samples_split=10,
    min_samples_leaf=5,
    random_state=42,
    n_jobs=-1,
    verbose=1
)

rf_model.fit(X_train, y_train)

# Evaluate Random Forest
rf_predictions = rf_model.predict(X_test)
rf_mae = mean_absolute_error(y_test, rf_predictions)
rf_rmse = np.sqrt(mean_squared_error(y_test, rf_predictions))
rf_r2 = r2_score(y_test, rf_predictions)

print(f"\n✓ Random Forest Model Results:")
print(f"  MAE: ${rf_mae:,.2f}")
print(f"  RMSE: ${rf_rmse:,.2f}")
print(f"  R² Score: {rf_r2:.4f}")
print(f"  Accuracy: {rf_r2 * 100:.2f}%")

# Train Gradient Boosting Model (AI-Based)
print("\n" + "="*60)
print("Training Gradient Boosting Model (AI-Based)...")
print("="*60)

gb_model = GradientBoostingRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5,
    min_samples_split=5,
    min_samples_leaf=2,
    subsample=0.8,
    random_state=42,
    verbose=1
)

gb_model.fit(X_train, y_train)

# Evaluate Gradient Boosting
gb_predictions = gb_model.predict(X_test)
gb_mae = mean_absolute_error(y_test, gb_predictions)
gb_rmse = np.sqrt(mean_squared_error(y_test, gb_predictions))
gb_r2 = r2_score(y_test, gb_predictions)

print(f"\n✓ Gradient Boosting Model Results:")
print(f"  MAE: ${gb_mae:,.2f}")
print(f"  RMSE: ${gb_rmse:,.2f}")
print(f"  R² Score: {gb_r2:.4f}")
print(f"  Accuracy: {gb_r2 * 100:.2f}%")

# Feature importance
print("\n" + "="*60)
print("Feature Importance (Random Forest):")
print("="*60)

feature_importance = pd.DataFrame({
    'feature': feature_columns_encoded,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

for idx, row in feature_importance.iterrows():
    print(f"  {row['feature']:<30} {row['importance']:.4f}")

# Save models with compression
print("\n" + "="*60)
print("Saving models and encoders with compression...")
print("="*60)

joblib.dump(rf_model, os.path.join(MODEL_DIR, 'random_forest_model.pkl'), compress=3)
joblib.dump(gb_model, os.path.join(MODEL_DIR, 'gradient_boosting_model.pkl'), compress=3)

# Save label encoders
for col, le in label_encoders.items():
    joblib.dump(le, os.path.join(MODEL_DIR, f'label_encoder_{col}.pkl'))

# Save model metadata
metadata = {
    'random_forest': {
        'mae': float(rf_mae),
        'rmse': float(rf_rmse),
        'r2_score': float(rf_r2),
        'accuracy': float(rf_r2 * 100),
        'n_estimators': 100,
        'training_samples': len(X_train)
    },
    'gradient_boosting': {
        'mae': float(gb_mae),
        'rmse': float(gb_rmse),
        'r2_score': float(gb_r2),
        'accuracy': float(gb_r2 * 100),
        'n_estimators': 200,
        'training_samples': len(X_train)
    },
    'feature_columns': feature_columns_encoded,
    'categorical_columns': categorical_columns,
    'dataset_size': len(df)
}

with open(os.path.join(MODEL_DIR, 'model_metadata.json'), 'w') as f:
    json.dump(metadata, f, indent=2)

print("\n✓ Models saved successfully!")
print("  - random_forest_model.pkl")
print("  - gradient_boosting_model.pkl")
print("  - label_encoder_*.pkl")
print("  - model_metadata.json")

print("\n" + "="*60)
print("Model Training Complete!")
print("="*60)
print(f"\nBest Model: {'Gradient Boosting' if gb_r2 > rf_r2 else 'Random Forest'}")
print(f"Best Accuracy: {max(rf_r2, gb_r2) * 100:.2f}%")
