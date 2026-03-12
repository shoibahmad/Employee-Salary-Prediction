import React, { useEffect } from 'react';
import './About.css';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stackData = [
    {
      category: "Frontend Architecture",
      icon: "⚛️",
      tech: ["React 18", "React Router v6", "Context API", "Chart.js"],
      description: "A high-performance reactive UI built with modern glassmorphism principles. Leverages stateful navigation and real-time data visualization for predictive analytics dashboards.",
      highlights: [
        "Dynamic Dark/Light Mode with HSL Token System",
        "Animated Glass-on-Glass UI Components",
        "Responsive Grid-Based Layouts",
        "60FPS Motion Design & Transitions"
      ]
    },
    {
      category: "Backend Infrastructure",
      icon: "🐍",
      tech: ["Python 3.12", "Flask 3.0", "NumPy & Pandas", "RESTful API"],
      description: "Enterprise-grade microservices handling high-frequency data processing and model orchestration. Hardened with CORS security and predictive error-state handling.",
      highlights: [
        "Asynchronous Data Processing Pipelines",
        "Hardened Security Headers",
        "Stateless Request Architecture",
        "Advanced JSON Payload Validation"
      ]
    },
    {
      category: "AI & Machine Learning",
      icon: "🧠",
      tech: ["Scikit-Learn", "Ensemble Methods", "Joblib", "StandardScaler"],
      description: "Dual-ensemble intelligence core using concurrent model benchmarks. Employs residual error minimization and feature importance ranking for high-precision outputs.",
      highlights: [
        "Random Forest (150+ Tree Ensemble)",
        "Gradient Boosting (Sequential Correction)",
        "Automated Feature Scaling & Encoding",
        "Confidence & Consensus Scoring Logic"
      ]
    },
    {
      category: "Cloud & Dev Services",
      icon: "☁️",
      tech: ["Firebase", "Firestore", "Render", "Vercel"],
      description: "Cloud-native deployment strategy ensuring global availability and secure data persistence. Real-time synchronization for employee records and authentication states.",
      highlights: [
        "Google Firebase Identity Protection",
        "NoSQL Scalable Document Storage",
        "CI/CD Pipeline Integration",
        "Encrypted Environment Management"
      ]
    }
  ];

  return (
    <div className="about-page animate-in">
      <div className="about-hero">
        <div className="hero-shimmer"></div>
        <span className="tech-badge">System Architecture</span>
        <h1 className="about-title">The Engineering Behind<br /><span>SalaryPredict</span></h1>
        <p className="about-subtitle">
          An end-to-end technical deep-dive into our modern full-stack ecosystem, 
          from high-precision ML models to a state-of-the-art glassmorphic UI.
        </p>
      </div>

      <div className="stack-grid">
        {stackData.map((item, index) => (
          <div key={index} className="stack-card glass-card">
            <div className="card-header">
              <div className="category-icon">{item.icon}</div>
              <div className="tech-tags">
                {item.tech.map((t, i) => <span key={i} className="tag">{t}</span>)}
              </div>
            </div>
            <h2 className="category-title">{item.category}</h2>
            <p className="category-desc">{item.description}</p>
            <ul className="highlights-list">
              {item.highlights.map((h, i) => (
                <li key={i}>
                  <span className="check">✓</span> {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="architecture-section glass-card">
        <div className="arch-header">
          <h2 className="section-title text-gradient">Data Flow Blueprint</h2>
          <p>How predictions travel through our system in milliseconds.</p>
        </div>
        
        <div className="flow-diagram">
          <div className="flow-node">
            <div className="node-icon">👤</div>
            <span>User Input</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-node">
            <div className="node-icon">🌐</div>
            <span>React Frontend</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-node highlight">
            <div className="node-icon">⚡</div>
            <span>Flask API</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-node highlight">
            <div className="node-icon">🤖</div>
            <span>ML Ensembles</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-node">
            <div className="node-icon">📊</div>
            <span>Insight Render</span>
          </div>
        </div>
      </div>

      <div className="about-footer-cta">
        <h2>Ready to see it in action?</h2>
        <div className="cta-btns">
          <a href="/predict" className="btn btn-primary">Try Prediction</a>
          <a href="/" className="btn btn-secondary">System Dashboard</a>
        </div>
      </div>
    </div>
  );
}

export default About;
