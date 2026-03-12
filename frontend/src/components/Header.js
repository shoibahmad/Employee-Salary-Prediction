import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  async function handleLogout() {
    try {
      await logout();
      navigate('/landing');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  }

  return (
    <header className="header premium-nav">
      <div className="header-container">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-box">
            <span className="logo-icon">💼</span>
          </div>
          <span className="logo-text">SalaryPredict</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {currentUser ? (
            <div className="nav-items">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
              <Link to="/predict" className={`nav-link ${isActive('/predict') ? 'active' : ''}`}>Predict</Link>
              <Link to="/employees" className={`nav-link ${isActive('/employees') ? 'active' : ''}`}>Employees</Link>
              <Link to="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>Analytics</Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>History</Link>
              <Link to="/budgeting" className={`nav-link ${isActive('/budgeting') ? 'active' : ''}`}>Budgeting</Link>
            </div>
          ) : (
            <div className="nav-items">
              <Link to="/landing" className={`nav-link ${isActive('/landing') ? 'active' : ''}`}>Features</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-small">Sign Up</Link>
            </div>
          )}
        </nav>

        <div className="header-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {currentUser && (
            <button className="desktop-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

          <button 
            className={`burger-menu ${menuOpen ? 'open' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-title">Menu</span>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>×</button>
        </div>
        
        <nav className="mobile-nav">
          {currentUser ? (
            <>
              <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/predict" className={`mobile-link ${isActive('/predict') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Predict</Link>
              <Link to="/employees" className={`mobile-link ${isActive('/employees') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Employees</Link>
              <Link to="/analytics" className={`mobile-link ${isActive('/analytics') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Analytics</Link>
              <Link to="/history" className={`mobile-link ${isActive('/history') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>History</Link>
              <Link to="/budgeting" className={`mobile-link ${isActive('/budgeting') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Budgeting</Link>
              <div className="drawer-footer">
                <button className="drawer-logout-btn" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/landing" className="mobile-link" onClick={() => setMenuOpen(false)}>Features</Link>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="mobile-btn btn-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>

      {menuOpen && <div className="drawer-backdrop" onClick={() => setMenuOpen(false)}></div>}
    </header>
  );
}

export default Header;
