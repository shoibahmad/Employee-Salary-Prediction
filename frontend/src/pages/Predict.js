import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Predict.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Predict() {
  const { currentUser } = useAuth();
  const [inputMode, setInputMode] = useState('single'); // 'single' or 'batch'
  const [formData, setFormData] = useState({
    name: '',
    years_experience: '',
    age: '',
    department: '',
    position: '',
    education: '',
    location: '',
    performance_score: '',
    technical_skills: '6',
    soft_skills: '6.5',
    certifications: '0',
    projects_completed: '',
    work_hours_per_week: '40',
    remote_work_percentage: '50'
  });

  const [options, setOptions] = useState({
    departments: [],
    positions: [],
    education_levels: [],
    locations: []
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelType, setModelType] = useState('model');

  // Batch states
  const [batchFile, setBatchFile] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [batchProgress, setBatchProgress] = useState(0);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/options`);
      setOptions(response.data);
    } catch (err) {
      setError('Failed to load options');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const makePrediction = async (data) => {
    const endpoint = modelType === 'model' ? '/predict/model' : '/predict/ai';
    const response = await axios.post(`${API_URL}${endpoint}`, {
      years_experience: parseInt(data.years_experience) || 0,
      age: parseInt(data.age) || 30,
      department: data.department || 'IT',
      position: data.position || 'Junior',
      education: data.education || 'Bachelor',
      location: data.location || 'New York',
      performance_score: parseFloat(data.performance_score) || 3.0,
      technical_skills: parseFloat(data.technical_skills) || 5.0,
      soft_skills: parseFloat(data.soft_skills) || 5.0,
      certifications: parseInt(data.certifications) || 0,
      projects_completed: parseInt(data.projects_completed) || 0,
      work_hours_per_week: parseFloat(data.work_hours_per_week) || 40,
      remote_work_percentage: parseFloat(data.remote_work_percentage) || 0
    });
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const data = {
        ...formData,
        projects_completed: formData.projects_completed || formData.years_experience * 2
      };

      // Fetch predictions from both models simultaneously
      const [modelRes, aiRes] = await Promise.all([
        axios.post(`${API_URL}/predict/model`, data),
        axios.post(`${API_URL}/predict/ai`, data)
      ]);

      setPrediction({
        model: modelRes.data,
        ai: aiRes.data
      });

      // Clear loading state as soon as results are ready
      setLoading(false);

      // Save to Firestore (non-blocking)
      saveToFirestore(data, modelRes.data, aiRes.data);

    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed');
      setLoading(false);
    }
  };

  const saveToFirestore = async (input, modelPred, aiPred) => {
    if (!currentUser) return;
    
    try {
      await addDoc(collection(db, 'predictions'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        inputData: input,
        modelResult: modelPred,
        aiResult: aiPred,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Error saving prediction to Firestore:", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBatchFile(e.target.files[0]);
    }
  };

  const handleBatchSubmit = async () => {
    if (!batchFile) return;
    setLoading(true);
    setError('');
    setBatchResults([]);
    setBatchProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        setError('CSV file is empty or missing headers');
        setLoading(false);
        return;
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const results = [];
      const dataRows = lines.slice(1);

      for (let i = 0; i < dataRows.length; i++) {
        const values = dataRows[i].split(',').map(v => v.trim());
        const rowData = {};

        headers.forEach((header, index) => {
          rowData[header] = values[index];
        });

        // Basic validation - check if we have enough data
        if (Object.keys(rowData).length >= 5) {
          try {
            const predResult = await makePrediction(rowData);
            results.push({
              name: rowData.name || `Employee ${i + 1}`,
              department: rowData.department || '-',
              job_role: rowData.position || '-',
              salary: predResult.predicted_salary,
              confidence: predResult.confidence,
              status: 'Success'
            });
          } catch (err) {
            results.push({
              name: rowData.name || `Employee ${i + 1}`,
              department: rowData.department || '-',
              job_role: rowData.position || '-',
              salary: 0,
              confidence: 0,
              status: 'Failed'
            });
          }
        }

        setBatchProgress(Math.round(((i + 1) / dataRows.length) * 100));
      }

      setBatchResults(results);
      setLoading(false);

      // Save batch summary to Firestore
      if (results.length > 0 && currentUser) {
        try {
          await addDoc(collection(db, 'prediction_batches'), {
            userId: currentUser.uid,
            userEmail: currentUser.email,
            recordCount: results.length,
            successCount: results.filter(r => r.status === 'Success').length,
            timestamp: serverTimestamp()
          });
        } catch (err) {
          console.error("Error saving batch to Firestore:", err);
        }
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
      setLoading(false);
    };

    reader.readAsText(batchFile);
  };

  return (
    <div className="predict-container">
      <div className="page-container glass-panel">
        <h1 className="page-title">Salary Prediction</h1>
        <p className="page-subtitle">
          Leverage AI to estimate fair compensation based on comprehensive employee profiles
        </p>

        <div className="prediction-tabs">
          <button
            className={`tab-btn ${inputMode === 'single' ? 'active' : ''}`}
            onClick={() => setInputMode('single')}
          >
            Single Prediction
          </button>
          <button
            className={`tab-btn ${inputMode === 'batch' ? 'active' : ''}`}
            onClick={() => setInputMode('batch')}
          >
            Batch Upload (CSV)
          </button>
        </div>

        <div className="model-selector">
          <button
            className={`model-btn ${modelType === 'model' ? 'active' : ''}`}
            onClick={() => setModelType('model')}
          >
            🤖 Model-Based <small>(~90%)</small>
          </button>
          <button
            className={`model-btn ${modelType === 'ai' ? 'active' : ''}`}
            onClick={() => setModelType('ai')}
          >
            🧠 AI-Based <small>(~94%)</small>
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {inputMode === 'single' ? (
          <form onSubmit={handleSubmit} className="predict-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Employee Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input type="number" name="years_experience" value={formData.years_experience} onChange={handleChange} required min="0" max="50" placeholder="5" />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required min="18" max="70" placeholder="30" />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  {options.departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Position</label>
                <select name="position" value={formData.position} onChange={handleChange} required>
                  <option value="">Select Position</option>
                  {options.positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Education Level</label>
                <select name="education" value={formData.education} onChange={handleChange} required>
                  <option value="">Select Education</option>
                  {options.education_levels.map(edu => <option key={edu} value={edu}>{edu}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <select name="location" value={formData.location} onChange={handleChange} required>
                  <option value="">Select Location</option>
                  {options.locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Performance Score (1-5)</label>
                <input type="number" name="performance_score" value={formData.performance_score} onChange={handleChange} required min="1" max="5" step="0.1" placeholder="4.5" />
              </div>

              <div className="form-group">
                <label>Technical Skills (1-10)</label>
                <input type="number" name="technical_skills" value={formData.technical_skills} onChange={handleChange} required min="1" max="10" step="0.1" placeholder="6" />
              </div>

              <div className="form-group">
                <label>Soft Skills (1-10)</label>
                <input type="number" name="soft_skills" value={formData.soft_skills} onChange={handleChange} required min="1" max="10" step="0.1" placeholder="6.5" />
              </div>

              <div className="form-group">
                <label>Certifications</label>
                <input type="number" name="certifications" value={formData.certifications} onChange={handleChange} required min="0" max="20" placeholder="0" />
              </div>

              <div className="form-group">
                <label>Projects Completed</label>
                <input type="number" name="projects_completed" value={formData.projects_completed} onChange={handleChange} placeholder="Auto-calculated" />
              </div>

              <div className="form-group">
                <label>Work Hours/Week</label>
                <input type="number" name="work_hours_per_week" value={formData.work_hours_per_week} onChange={handleChange} required min="20" max="80" step="0.1" placeholder="40" />
              </div>

              <div className="form-group">
                <label>Remote Work %</label>
                <input type="number" name="remote_work_percentage" value={formData.remote_work_percentage} onChange={handleChange} required min="0" max="100" step="1" placeholder="50" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
                {loading ? 'Predicting...' : (prediction ? 'Update Prediction' : 'Predict Salary')}
              </button>
            </div>
          </form>
        ) : (
          <div className="batch-upload-section">
            <label className="upload-area">
              <input type="file" accept=".csv" onChange={handleFileChange} />
              <div className="upload-icon">📄</div>
              <h3>{batchFile ? batchFile.name : 'Upload Employee Data (CSV)'}</h3>
              <p className="page-subtitle">Drag and drop or click to browse</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Required columns: age, years_experience, department, position, education, location...</p>
            </label>

            <button
              className="btn btn-primary btn-submit"
              onClick={handleBatchSubmit}
              disabled={!batchFile || loading}
            >
              {loading ? `Processing... ${batchProgress}%` : 'Run Batch Prediction'}
            </button>

            {batchResults.length > 0 && (
              <div className="batch-results">
                <h3>Batch Results ({batchResults.length} records)</h3>
                <table className="batch-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Predicted Salary</th>
                      <th>Confidence</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((res, idx) => (
                      <tr key={idx}>
                        <td>{res.name}</td>
                        <td>{res.department}</td>
                        <td>{res.job_role}</td>
                        <td style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>
                          {res.status === 'Success' ? `₹${res.salary.toLocaleString('en-IN')}` : 'N/A'}
                        </td>
                        <td>{res.status === 'Success' ? `${(res.confidence * 100).toFixed(1)}%` : '-'}</td>
                        <td style={{ color: res.status === 'Success' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {res.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {prediction && inputMode === 'single' && (
          <div className="prediction-results-compare">
            <h2 className="comparison-title">Model Comparison Analysis</h2>
            <div className="compare-grid">
              {/* Model Based Card */}
              <div className="result-card compared glass-card">
                <div className="result-header">
                  <span className="model-badge">🤖 RandomForest</span>
                  <h3>Model Prediction</h3>
                </div>
                <div className="result-main">
                  <p className="result-label">ESTIMATED SALARY</p>
                  <p className="result-value salary">
                    ₹{prediction.model.predicted_salary.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="result-footer">
                  <div className="confidence-metric">
                    <span>Confidence</span>
                    <div className="mini-progress">
                      <div className="fill" style={{ width: `${prediction.model.confidence * 100}%` }}></div>
                    </div>
                    <strong>{(prediction.model.confidence * 100).toFixed(1)}%</strong>
                  </div>
                </div>
              </div>

              {/* AI Based Card */}
              <div className="result-card compared featured glass-card">
                <div className="result-header">
                  <span className="model-badge ai">🧠 GradientBoosting</span>
                  <h3>AI Recommendation</h3>
                </div>
                <div className="result-main">
                  <p className="result-label">ESTIMATED SALARY</p>
                  <p className="result-value salary highlight">
                    ₹{prediction.ai.predicted_salary.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="result-footer">
                  <div className="confidence-metric">
                    <span>Confidence</span>
                    <div className="mini-progress">
                      <div className="fill featured" style={{ width: `${prediction.ai.confidence * 100}%` }}></div>
                    </div>
                    <strong>{(prediction.ai.confidence * 100).toFixed(1)}%</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="variance-insight">
              <div className="insight-icon">💡</div>
              <p>
                <strong>Variance Insight:</strong> There is a 
                {` $${Math.abs(prediction.model.predicted_salary - prediction.ai.predicted_salary).toLocaleString()} `}
                difference between models. 
                {Math.abs(prediction.model.predicted_salary - prediction.ai.predicted_salary) / prediction.ai.predicted_salary < 0.05 
                  ? " High model consensus indicates a very reliable prediction."
                  : " Moderate variance suggests complex feature interactions; using the AI-based average is recommended."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Predict;
