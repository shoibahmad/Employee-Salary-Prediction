import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/predictions/history`);
      setHistory(response.data);
    } catch (err) {
      setError('Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = filter === 'all'
    ? history
    : history.filter(item => item.model_type.includes(filter === 'model' ? 'Random Forest' : 'Gradient Boosting'));

  const exportToCSV = () => {
    if (filteredHistory.length === 0) return;

    // Create CSV header
    const headers = [
      'Model Type', 'Predicted Salary', 'Confidence', 'Department',
      'Position', 'Education', 'Years Experience', 'Age', 'Performance Score'
    ];

    // Create CSV rows
    const csvRows = filteredHistory.map(row => [
      `"${row.model_type}"`,
      row.predicted_salary,
      row.confidence,
      `"${row.department}"`,
      `"${row.position}"`,
      `"${row.education}"`,
      row.years_experience,
      row.age,
      row.performance_score
    ].join(','));

    // Combine header and rows
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...csvRows].join('\n');

    // Download logic
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Prediction_History_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="page-container glass-panel">
        <div className="loading">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container glass-panel">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="page-container glass-panel">
        <h1 className="page-title">Prediction History</h1>
        <p className="page-subtitle">View all salary predictions made in the system</p>

        <div className="history-controls">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Predictions
            </button>
            <button
              className={`filter-btn ${filter === 'model' ? 'active' : ''}`}
              onClick={() => setFilter('model')}
            >
              Model-Based
            </button>
            <button
              className={`filter-btn ${filter === 'ai' ? 'active' : ''}`}
              onClick={() => setFilter('ai')}
            >
              AI-Based
            </button>
          </div>
          <div className="history-actions">
            <div className="history-count">
              Total: {filteredHistory.length}
            </div>
            <button className="btn-export" onClick={exportToCSV} disabled={filteredHistory.length === 0}>
              📥 Export CSV
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <p>No prediction history available. Start making predictions!</p>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((item, index) => (
              <div key={index} className="history-card">
                <div className="history-header">
                  <div className="history-number">#{filteredHistory.length - index}</div>
                  <div className="history-model">
                    {item.model_type.includes('Random Forest') ? '🤖' : '🧠'} {item.model_type}
                  </div>
                </div>

                <div className="history-content">
                  <div className="history-details">
                    <div className="detail-row">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{item.department}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Position:</span>
                      <span className="detail-value">{item.position}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Education:</span>
                      <span className="detail-value">{item.education}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{item.years_experience} years</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Age:</span>
                      <span className="detail-value">{item.age} years</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Performance:</span>
                      <span className="detail-value">{item.performance_score}/5</span>
                    </div>
                  </div>

                  <div className="history-result">
                    <div className="result-salary">
                      <span className="result-label">Predicted Salary</span>
                      <span className="result-amount">
                        ₹{item.predicted_salary.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="result-confidence">
                      <span className="confidence-label">Confidence</span>
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${item.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="confidence-value">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
