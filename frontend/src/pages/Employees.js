import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Employees.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    hire_date: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/employees`);
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/employees`, formData);
      setSuccess('Employee added successfully!');
      setFormData({
        name: '',
        email: '',
        department: '',
        position: '',
        salary: '',
        hire_date: ''
      });
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
    }
  };

  const exportToCSV = () => {
    if (employees.length === 0) return;

    // Create CSV header
    const headers = ['Name', 'Email', 'Department', 'Position', 'Salary', 'Hire Date'];

    // Create CSV rows
    const csvRows = employees.map(emp => [
      `"${emp.name}"`,
      `"${emp.email}"`,
      `"${emp.department}"`,
      `"${emp.position}"`,
      emp.salary,
      `"${emp.hire_date}"`
    ].join(','));

    // Combine header and rows
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...csvRows].join('\n');

    // Download logic
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Employees_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="employees-container">
      <div className="page-container glass-panel">
        <h1 className="page-title">Employee Management</h1>
        <p className="page-subtitle">Manage your employee records and information</p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="employees-header">
          <button className="btn-export" onClick={exportToCSV} disabled={employees.length === 0}>
            📥 Export CSV
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add Employee'}
          </button>
        </div>

        {showForm && (
          <div className="employee-form-container">
            <h3>Add New Employee</h3>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    placeholder="IT"
                  />
                </div>

                <div className="form-group">
                  <label>Position *</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    placeholder="Senior Developer"
                  />
                </div>

                <div className="form-group">
                  <label>Salary *</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    placeholder="75000"
                  />
                </div>

                <div className="form-group">
                  <label>Hire Date *</label>
                  <input
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Add Employee
              </button>
            </form>
          </div>
        )}

        <div className="employees-list">
          <h3>Employee List ({employees.length})</h3>
          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <p>No employees found. Add your first employee!</p>
            </div>
          ) : (
            <div className="employees-grid">
              {employees.map((employee) => (
                <div key={employee.id} className="employee-card">
                  <div className="employee-avatar">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                  <h4>{employee.name}</h4>
                  <p className="employee-email">{employee.email}</p>
                  <div className="employee-details">
                    <div className="detail-item">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{employee.department}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Position:</span>
                      <span className="detail-value">{employee.position}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Salary:</span>
                      <span className="detail-value salary">
                        ₹{parseFloat(employee.salary).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Hire Date:</span>
                      <span className="detail-value">{employee.hire_date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employees;
