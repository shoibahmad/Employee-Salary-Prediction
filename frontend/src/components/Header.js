import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header glass-nav">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">💼</span>
          <span className="logo-text">SalaryPredict</span>
        </Link>


        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/predict"
            className={`nav-link ${isActive('/predict') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Predict
          </Link>
          <Link
            to="/employees"
            className={`nav-link ${isActive('/employees') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Employees
          </Link>
          <Link
            to="/analytics"
            className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Analytics
          </Link>
          <Link
            to="/history"
            className={`nav-link ${isActive('/history') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            History
          </Link>
        </nav>

        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
