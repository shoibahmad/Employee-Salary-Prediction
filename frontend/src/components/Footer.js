import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FooterModal from './FooterModal';
import './Footer.css';

function Footer() {
  const [openModal, setOpenModal] = useState(null); // 'privacy' | 'terms' | 'about' | null
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/predict', label: 'Predict' },
    { to: '/employees', label: 'Employees' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/history', label: 'History' },
  ];

  const legalLinks = [
    { id: 'about', label: '📖 About Project' },
    { id: 'privacy', label: '🔒 Privacy Policy' },
    { id: 'terms', label: '📜 Terms & Conditions' },
  ];

  const techBadges = ['Python', 'Flask', 'scikit-learn', 'React', 'Chart.js', 'Axios'];

  return (
    <>
      {openModal && (
        <FooterModal modalId={openModal} onClose={() => setOpenModal(null)} />
      )}

      <footer className="footer">
        <div className="footer-inner">

          {/* Top Shimmer Line */}
          <div className="footer-shimmer" />

          {/* ── Main Grid ── */}
          <div className="footer-grid">

            {/* Brand Column */}
            <div className="footer-brand-col">
              <div className="footer-logo">
                <div className="footer-logo-icon">💼</div>
                <span className="footer-logo-text">SalaryPredict</span>
              </div>
              <p className="footer-tagline">
                AI-powered salary predictions using Random Forest & Gradient Boosting machine learning models.
              </p>
              <div className="footer-badges">
                {techBadges.map(badge => (
                  <span key={badge} className="footer-badge">{badge}</span>
                ))}
              </div>
            </div>

            {/* Navigation Column */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Navigation</h4>
              <ul className="footer-links-list">
                {navLinks.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer-nav-link">
                      <span className="footer-link-arrow">›</span> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Info Column */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Information</h4>
              <ul className="footer-links-list">
                {legalLinks.map(link => (
                  <li key={link.id}>
                    <button
                      className="footer-modal-link"
                      onClick={() => setOpenModal(link.id)}
                    >
                      <span className="footer-link-arrow">›</span> {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Column */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Tech Stack</h4>
              <div className="footer-tech-list">
                <div className="footer-tech-item">
                  <span className="footer-tech-dot backend" />
                  <span className="footer-tech-label">Backend</span>
                  <span className="footer-tech-value">Python · Flask</span>
                </div>
                <div className="footer-tech-item">
                  <span className="footer-tech-dot ml" />
                  <span className="footer-tech-label">ML</span>
                  <span className="footer-tech-value">scikit-learn · joblib</span>
                </div>
                <div className="footer-tech-item">
                  <span className="footer-tech-dot frontend" />
                  <span className="footer-tech-label">Frontend</span>
                  <span className="footer-tech-value">React 18 · Axios</span>
                </div>
                <div className="footer-tech-item">
                  <span className="footer-tech-dot charts" />
                  <span className="footer-tech-label">Charts</span>
                  <span className="footer-tech-value">Chart.js · react-chartjs-2</span>
                </div>
                <div className="footer-tech-item">
                  <span className="footer-tech-dot data" />
                  <span className="footer-tech-label">Data</span>
                  <span className="footer-tech-value">pandas · numpy</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── Bottom Bar ── */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>© {currentYear} SalaryPredict. Built with</span>
              <span className="footer-heart">♥</span>
              <span>using AI & Machine Learning.</span>
            </div>
            <div className="footer-bottom-right">
              {legalLinks.map((link, i) => (
                <React.Fragment key={link.id}>
                  <button
                    className="footer-bottom-link"
                    onClick={() => setOpenModal(link.id)}
                  >
                    {link.label.split(' ').slice(1).join(' ')}
                  </button>
                  {i < legalLinks.length - 1 && <span className="footer-dot">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;
