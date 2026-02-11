import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AboutModal - Information about the Full-Stack Flow app
 * Reuses file-modal styles for consistency
 */
const AboutModal = ({ onClose }) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Close when clicking backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Info icon SVG
  const InfoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="file-modal__icon">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  // Close icon SVG
  const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <div 
      className="file-modal__backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div className="file-modal">
        {/* Header */}
        <div className="file-modal__header">
          <div className="file-modal__header-content">
            <div 
              className="file-modal__icon-wrapper"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
            >
              <InfoIcon />
            </div>
            <div className="file-modal__title-group">
              <h2 id="about-modal-title" className="file-modal__title">
                About Full-Stack Flow
              </h2>
              <p className="file-modal__path">Interactive Learning Tool</p>
            </div>
          </div>
          <button 
            className="file-modal__close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="file-modal__body">
          <div className="file-modal__section">
            <h3 className="file-modal__section-title">What is this?</h3>
            <p className="file-modal__description">
              An interactive visualization showing how data flows through a full-stack web application — from user click to database and back to the browser.
            </p>
          </div>

          <div className="file-modal__section">
            <h3 className="file-modal__section-title">How to use</h3>
            <div className="file-modal__details">
              <div className="file-modal__detail">
                <span className="file-modal__detail-label">Click nodes</span>
                <span className="file-modal__detail-value">View code examples at each step</span>
              </div>
              <div className="file-modal__detail">
                <span className="file-modal__detail-label">Click files</span>
                <span className="file-modal__detail-value">See file details and purpose</span>
              </div>
              <div className="file-modal__detail">
                <span className="file-modal__detail-label">Animate</span>
                <span className="file-modal__detail-value">Watch the data flow step by step</span>
              </div>
            </div>
          </div>

          <div className="file-modal__section">
            <h3 className="file-modal__section-title">Who is this for?</h3>
            <p className="file-modal__description">
              Developers learning full-stack architecture, students studying web development, or anyone curious about how modern web apps work under the hood.
            </p>
          </div>

          <div className="file-modal__section">
            <h3 className="file-modal__section-title">The Flow</h3>
            <p className="file-modal__description">
              User Action → React Component → HTTP Request → Express Server → Database Query → Response → State Update → DOM Render → Cycle Repeats
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="file-modal__footer">
          <button className="file-modal__btn" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

AboutModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AboutModal;
