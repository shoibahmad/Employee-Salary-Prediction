import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container glass-panel">
        <div className="loading">Loading analytics...</div>
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

  if (!analytics || analytics.total_predictions === 0) {
    return (
      <div className="page-container glass-panel">
        <h1 className="page-title">Analytics Dashboard</h1>
        <div className="empty-state">
          <p>No analytics data available yet. Make some predictions first!</p>
        </div>
      </div>
    );
  }

  const departmentData = {
    labels: Object.keys(analytics.department_stats),
    datasets: [
      {
        label: 'Average Salary by Department',
        data: Object.values(analytics.department_stats),
        backgroundColor: [
          'hsla(235, 85%, 65%, 0.7)',
          'hsla(198, 93%, 60%, 0.7)',
          'hsla(330, 81%, 70%, 0.7)',
          'hsla(150, 70%, 55%, 0.7)',
          'hsla(45, 95%, 60%, 0.7)',
          'hsla(280, 80%, 65%, 0.7)',
        ],
        borderColor: [
          'hsl(235, 85%, 65%)',
          'hsl(198, 93%, 60%)',
          'hsl(330, 81%, 70%)',
          'hsl(150, 70%, 55%)',
          'hsl(45, 95%, 60%)',
          'hsl(280, 80%, 65%)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const positionData = {
    labels: Object.keys(analytics.position_stats),
    datasets: [
      {
        label: 'Average Salary by Position',
        data: Object.values(analytics.position_stats),
        backgroundColor: [
          'hsla(235, 85%, 65%, 0.8)',
          'hsla(198, 93%, 60%, 0.8)',
          'hsla(330, 81%, 70%, 0.8)',
          'hsla(150, 70%, 55%, 0.8)',
          'hsla(45, 95%, 60%, 0.8)',
          'hsla(280, 80%, 65%, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const retentionData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [
          analytics.retention_risk?.high || 0,
          analytics.retention_risk?.medium || 0,
          analytics.retention_risk?.low || 0,
        ],
        backgroundColor: [
          'hsla(0, 85%, 60%, 0.8)',
          'hsla(35, 95%, 60%, 0.8)',
          'hsla(150, 70%, 55%, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text-main)',
          font: { family: 'Inter, sans-serif' }
        }
      },
    },
    scales: {
      x: {
        ticks: { color: 'var(--text-muted)' },
        grid: { color: 'var(--border-color)', drawBorder: false }
      },
      y: {
        ticks: { color: 'var(--text-muted)' },
        grid: { color: 'var(--border-color)', drawBorder: false }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-main)',
          font: { family: 'Inter, sans-serif', size: 12 },
          padding: 20
        }
      },
    }
  };

  return (
    <div className="analytics-container">
      <div className="page-container glass-panel">
        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="page-subtitle">Comprehensive salary insights, retention risks, and market benchmarks</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Predictions</h3>
              <p className="stat-value">{analytics.total_predictions}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚖️</div>
            <div className="stat-content">
              <h3>Market Gap</h3>
              <p className="stat-value">{analytics.avg_market_gap}%</p>
            </div>
          </div>

          <div className="stat-card alert">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>High Risk Employees</h3>
              <p className="stat-value">{analytics.retention_risk?.high || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Average Salary</h3>
              <p className="stat-value">₹{analytics.avg_salary.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="charts-grid main-charts">
          <div className="chart-container">
            <h3>Salary by Department</h3>
            <div className="chart-wrapper">
              <Bar data={departmentData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container">
            <h3>Employee Retention Risk</h3>
            <div className="chart-wrapper">
              <Pie data={retentionData} options={pieOptions} />
            </div>
          </div>
        </div>

        <div className="insights-section">
          <h3>Advanced Insights</h3>
          <div className="insights-grid">
            <div className="insight-card highlight">
              <h4>🛡️ Retention Strategy</h4>
              <p>
                {analytics.retention_risk?.high > 0 
                  ? `${analytics.retention_risk.high} employees are severely underpaid relative to the market. Urgent review recommended.`
                  : "Salary levels are healthy. Retention risk is currently low."}
              </p>
            </div>
            <div className="insight-card">
              <h4>🎯 Market Competitiveness</h4>
              <p>
                Your average salary is {analytics.avg_market_gap}% {analytics.avg_market_gap > 0 ? 'below' : 'above'} the simulated market benchmark.
              </p>
            </div>
            <div className="insight-card">
              <h4>💼 Position Growth</h4>
              <p>
                {Object.entries(analytics.position_stats).sort((a,b) => b[1]-a[1])[0]?.[0]} roles lead in compensation growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
