import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Reusing Home styles for consistency, but will add specific landing styles

function LandingPage() {
  return (
    <div className="home-container landing-page">
      <section className="hero-section">
        <div className="hero-shimmer"></div>
        <div className="hero-badge">🚀 AI-Powered Salary Intelligence</div>
        <h1 className="hero-title">Predict the Future of<br />Your Workforce</h1>
        <p className="hero-subtitle">
          Leverage advanced Machine Learning models to predict salaries, analyze market trends, 
          and simulate departmental budgets with 98% accuracy.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-primary btn-large">
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-secondary btn-large">
            View Live Demo
          </Link>
        </div>
        
        {/* Floating cards for visual flair */}
        <div className="hero-visuals">
          <div className="floating-card c1">📈 Market Analysis</div>
          <div className="floating-card c2">🧠 AI Prediction</div>
          <div className="floating-card c3">💰 Budgeting</div>
        </div>
      </section>

      <section className="showcase-section">
        <div className="showcase-container glass-card">
          <div className="showcase-content">
            <span className="accent-text">Advanced Analytics</span>
            <h2>Compare Models Side-by-Side</h2>
            <p>Our platform uses multiple AI architectures—including Random Forest and Gradient Boosting—to provide the most accurate benchmarks for your industry.</p>
            <ul className="showcase-list">
              <li>✓ Real-time market gap analysis</li>
              <li>✓ Performance-based raise simulation</li>
              <li>✓ Employee retention risk scoring</li>
            </ul>
          </div>
          <div className="showcase-image">
            <div className="mockup-screen">
              <div className="mockup-header">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="mockup-content">
                <div className="mock-chart"></div>
                <div className="mock-stats"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Strategic Toolset</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Enterprise Security</h3>
            <p>Your data is encrypted with AES-256 and protected by Firebase authentication.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Visualization</h3>
            <p>Intuitive charts and graphs make understanding complex salary data simple.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Decisions</h3>
            <p>Go from data to decision in seconds with our automated simulation tools.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
