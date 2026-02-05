import React, { useEffect } from 'react';

/**
 * FileDetailModal - Shows detailed information about a file in the flow
 * Displays file path, description, and context within the flow
 */
const FileDetailModal = ({ file, node, onClose }) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
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

  // Get file extension for icon
  const getFileExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return ext;
  };

  // Get file type label and color
  const getFileTypeInfo = (filename) => {
    const ext = getFileExtension(filename);
    const types = {
      jsx: { label: 'React Component', color: '#61dafb', bg: 'rgba(97, 218, 251, 0.15)' },
      js: { label: 'JavaScript', color: '#f7df1e', bg: 'rgba(247, 223, 30, 0.15)' },
      ts: { label: 'TypeScript', color: '#3178c6', bg: 'rgba(49, 120, 198, 0.15)' },
      tsx: { label: 'TypeScript React', color: '#3178c6', bg: 'rgba(49, 120, 198, 0.15)' },
      css: { label: 'Stylesheet', color: '#264de4', bg: 'rgba(38, 77, 228, 0.15)' },
      scss: { label: 'SASS Stylesheet', color: '#cc6699', bg: 'rgba(204, 102, 153, 0.15)' },
      json: { label: 'JSON', color: '#f5a623', bg: 'rgba(245, 166, 35, 0.15)' },
      sql: { label: 'SQL', color: '#00758f', bg: 'rgba(0, 117, 143, 0.15)' },
      py: { label: 'Python', color: '#3776ab', bg: 'rgba(55, 118, 171, 0.15)' },
      rb: { label: 'Ruby', color: '#cc342d', bg: 'rgba(204, 52, 45, 0.15)' },
      go: { label: 'Go', color: '#00add8', bg: 'rgba(0, 173, 216, 0.15)' },
      rs: { label: 'Rust', color: '#dea584', bg: 'rgba(222, 165, 132, 0.15)' },
      html: { label: 'HTML', color: '#e34c26', bg: 'rgba(227, 76, 38, 0.15)' },
      vue: { label: 'Vue Component', color: '#42b883', bg: 'rgba(66, 184, 131, 0.15)' },
      svelte: { label: 'Svelte Component', color: '#ff3e00', bg: 'rgba(255, 62, 0, 0.15)' },
    };
    return types[ext] || { label: 'File', color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.15)' };
  };

  const fileTypeInfo = getFileTypeInfo(file.name);

  // File icon SVG
  const FileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="file-modal__icon">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
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
      aria-labelledby="file-modal-title"
    >
      <div className="file-modal">
        {/* Header */}
        <div className="file-modal__header">
          <div className="file-modal__header-content">
            <div 
              className="file-modal__icon-wrapper"
              style={{ backgroundColor: `${node.color}20` }}
            >
              <FileIcon />
            </div>
            <div className="file-modal__title-group">
              <h2 
                id="file-modal-title" 
                className="file-modal__title"
                style={{ color: fileTypeInfo.color }}
              >
                {file.name}
              </h2>
              <span className="file-modal__path">{file.path}</span>
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
          {/* Context */}
          <div 
            className="file-modal__context"
            style={{ 
              borderColor: `${node.color}40`,
              backgroundColor: `${node.color}10`
            }}
          >
            <span 
              className="file-modal__context-dot"
              style={{ backgroundColor: node.color }}
            />
            <span className="file-modal__context-text">
              Part of <strong style={{ color: node.color }}>{node.label}</strong> stage
            </span>
          </div>

          {/* Description */}
          <div 
            className="file-modal__section"
            style={{ borderLeftColor: node.color }}
          >
            <h3 className="file-modal__section-title">Description</h3>
            <p className="file-modal__description">
              {file.description || 'No description available for this file.'}
            </p>
          </div>

          {/* File Details */}
          <div 
            className="file-modal__section"
            style={{ borderLeftColor: fileTypeInfo.color }}
          >
            <h3 className="file-modal__section-title">Details</h3>
            <div className="file-modal__details">
              <div className="file-modal__detail">
                <span className="file-modal__detail-label">Type</span>
                <span 
                  className="file-modal__detail-badge"
                  style={{ 
                    color: fileTypeInfo.color, 
                    backgroundColor: fileTypeInfo.bg,
                    borderColor: fileTypeInfo.color 
                  }}
                >
                  {fileTypeInfo.label}
                </span>
              </div>
              <div className="file-modal__detail">
                <span className="file-modal__detail-label">Extension</span>
                <span 
                  className="file-modal__detail-value file-modal__detail-value--mono"
                  style={{ color: fileTypeInfo.color }}
                >
                  .{getFileExtension(file.name)}
                </span>
              </div>
              <div className="file-modal__detail">
                <span className="file-modal__detail-label">Location</span>
                <span className="file-modal__detail-value file-modal__detail-value--mono">
                  {file.path}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="file-modal__footer">
          <button 
            className="file-modal__btn" 
            onClick={onClose}
            style={{ backgroundColor: node.color }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDetailModal;
