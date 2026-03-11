import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-shimmer"></div>
        <div className="hero-badge">✨ Powered by Machine Learning & AI</div>
        <h1 className="hero-title">Employee Salary<br />Prediction System</h1>
        <p className="hero-subtitle">
          Leverage the power of Random Forest & Gradient Boosting AI to predict
          accurate employee salaries with up to 97% confidence.
        </p>
        <div className="hero-buttons">
          <Link to="/predict" className="btn btn-primary btn-large">
            🚀 Start Predicting
          </Link>
          <Link to="/analytics" className="btn btn-secondary btn-large">
            📊 View Analytics
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Model-Based Prediction</h3>
            <p>Random Forest algorithm for accurate salary predictions based on historical data</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI-Based Prediction</h3>
            <p>Advanced Gradient Boosting AI model for enhanced prediction accuracy</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Analytics</h3>
            <p>Comprehensive analytics dashboard with interactive visualizations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Employee Management</h3>
            <p>Manage employee records and track salary predictions efficiently</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Prediction History</h3>
            <p>Track all predictions with detailed history and insights</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>High Accuracy</h3>
            <p>Achieve 85–97% prediction confidence with our advanced models</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Input Data</h3>
            <p>Enter employee details including experience, education, and position</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose Model</h3>
            <p>Select between Model-Based or AI-Based prediction algorithms</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Results</h3>
            <p>Receive accurate salary predictions with confidence scores</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Analyze</h3>
            <p>Review analytics and make informed compensation decisions</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Start predicting salaries with our advanced AI system today</p>
        <Link to="/predict" className="btn btn-primary btn-large">
          Make Your First Prediction →
        </Link>
      </section>
    </div>
  );
}

export default Home;
