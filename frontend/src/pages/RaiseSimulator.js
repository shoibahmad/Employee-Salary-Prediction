import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RaiseSimulator.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function RaiseSimulator() {
  const [budget, setBudget] = useState(50000);
  const [department, setDepartment] = useState('All');
  const [departments, setDepartments] = useState(['All']);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/options`);
      setDepartments(['All', ...response.data.departments]);
    } catch (err) {
      console.error('Failed to load departments');
    }
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/budget/simulate`, {
        department,
        budget: parseFloat(budget)
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Simulation failed. Ensure you have employees added.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulator-container">
      <div className="page-container glass-panel">
        <h1 className="page-title">Salary Raise Simulator</h1>
        <p className="page-subtitle">Strategically distribute bonuses based on performance scores and budget.</p>

        <form onSubmit={handleSimulate} className="simulator-controls glass-form">
          <div className="form-group">
            <label>Total Budget ($)</label>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : '🚀 Simulate Distribution'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {results && (
          <div className="results-section">
            <div className="summary-cards">
              <div className="stat-card">
                <h3>Total Distributed</h3>
                <p className="stat-value">${results.total_distributed.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>Avg. Bonus %</h3>
                <p className="stat-value">
                  {(results.employees.reduce((acc, curr) => acc + curr.perf_bonus_pct, 0) / results.employees.length).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="employee-raise-list">
              <h3>Individual Recommendations</h3>
              <div className="raise-table-wrapper">
                <table className="raise-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Current Salary</th>
                      <th>Suggested Raise</th>
                      <th>New Salary</th>
                      <th>Bonus %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.employees.map((emp, i) => (
                      <tr key={i}>
                        <td className="emp-name">{emp.name}</td>
                        <td>${emp.current_salary.toLocaleString()}</td>
                        <td className="raise-amt">+${emp.suggested_raise.toLocaleString()}</td>
                        <td className="new-salary">${emp.new_salary.toLocaleString()}</td>
                        <td>
                          <span className={`bonus-badge ${emp.perf_bonus_pct > 10 ? 'high' : 'normal'}`}>
                            {emp.perf_bonus_pct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RaiseSimulator;
