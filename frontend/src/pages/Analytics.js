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
          'rgba(99, 102, 241, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
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
          'rgba(99, 102, 241, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
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
          font: {
            family: 'Inter, sans-serif'
          }
        }
      },
    },
    scales: {
      x: {
        ticks: { color: 'var(--text-muted)' },
        grid: { color: 'var(--border-color)' }
      },
      y: {
        ticks: { color: 'var(--text-muted)' },
        grid: { color: 'var(--border-color)' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text-main)',
          font: {
            family: 'Inter, sans-serif'
          }
        }
      },
    }
  };

  return (
    <div className="analytics-container">
      <div className="page-container glass-panel">
        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="page-subtitle">Comprehensive salary insights and statistics</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Predictions</h3>
              <p className="stat-value">{analytics.total_predictions}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Average Salary</h3>
              <p className="stat-value">${analytics.avg_salary.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📉</div>
            <div className="stat-content">
              <h3>Minimum Salary</h3>
              <p className="stat-value">${analytics.min_salary.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Maximum Salary</h3>
              <p className="stat-value">${analytics.max_salary.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h3>Salary by Department</h3>
            <div className="chart-wrapper">
              <Bar data={departmentData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container">
            <h3>Salary Distribution by Position</h3>
            <div className="chart-wrapper">
              <Pie data={positionData} options={pieOptions} />
            </div>
          </div>
        </div>

        <div className="insights-section">
          <h3>Key Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>🎯 Highest Paying Department</h4>
              <p>
                {Object.entries(analytics.department_stats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </div>
            <div className="insight-card">
              <h4>💼 Highest Paying Position</h4>
              <p>
                {Object.entries(analytics.position_stats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </div>
            <div className="insight-card">
              <h4>📊 Salary Range</h4>
              <p>
                ${(analytics.max_salary - analytics.min_salary).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
