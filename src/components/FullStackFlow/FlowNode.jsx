import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Individual flow node component representing a step in the data flow
 * Handles click interactions and animation states
 */
const FlowNode = ({
  node,
  isActive,
  onClick,
  animationStep,
  index,
  isAnimating,
  onFileClick,
  compact = false
}) => {
  const [hoveredFile, setHoveredFile] = useState(null);
  const isPulsing = animationStep === index;
  const isVisible = animationStep >= index || !isAnimating;

  const handleClick = () => {
    onClick(node.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(node.id);
    }
  };

  const handleFileClick = (e, file) => {
    e.stopPropagation(); // Prevent node click
    if (onFileClick) {
      onFileClick(file, node);
    }
  };

  return (
    <div
      className={`flow-node ${isActive ? 'flow-node--active' : ''} ${isVisible ? '' : 'flow-node--hidden'} ${compact ? 'flow-node--compact' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      style={{
        '--node-color': node.color,
        '--node-color-light': `${node.color}30`,
        borderColor: isActive ? node.color : undefined,
        backgroundColor: isActive ? `${node.color}30` : undefined
      }}
      aria-pressed={isActive}
      aria-label={`${node.label}: ${node.sublabel}`}
    >
      {/* Pulse animation overlay */}
      {isPulsing && (
        <span
          className="flow-node__pulse"
          style={{ backgroundColor: node.color }}
          aria-hidden="true"
        />
      )}

      {/* Color indicator dot */}
      <span
        className="flow-node__dot"
        style={{ backgroundColor: node.color }}
        aria-hidden="true"
      />

      {/* Node label */}
      <span className="flow-node__label">
        {node.label}
      </span>

      {/* Optional detail text (e.g., "HTML/CSS/JavaScript") */}
      {node.detail && (
        <span className="flow-node__detail">
          {node.detail}
        </span>
      )}

      {/* Sublabel */}
      <span className="flow-node__sublabel">
        {node.sublabel}
      </span>

      {/* File chips */}
      {node.files && node.files.length > 0 && (
        <div className="flow-node__files">
          {node.files.map((file) => (
            <button
              key={file.path}
              className="flow-node__file-chip"
              onClick={(e) => handleFileClick(e, file)}
              onMouseEnter={() => setHoveredFile(file.path)}
              onMouseLeave={() => setHoveredFile(null)}
              title={file.path}
              style={{
                '--chip-color': node.color,
                color: node.color
              }}
            >
              <svg 
                className="flow-node__file-icon" 
                viewBox="0 0 16 16" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3.5 2A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0012.5 4H9.621a1.5 1.5 0 01-1.06-.44L7.439 2.44A1.5 1.5 0 006.378 2H3.5z"/>
              </svg>
              <span className="flow-node__file-name">{file.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

FlowNode.propTypes = {
  /** Node data object */
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sublabel: PropTypes.string.isRequired,
    detail: PropTypes.string,
    color: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    }))
  }).isRequired,
  /** Whether this node is currently selected */
  isActive: PropTypes.bool.isRequired,
  /** Click handler - receives node id */
  onClick: PropTypes.func.isRequired,
  /** Current animation step index */
  animationStep: PropTypes.number.isRequired,
  /** This node's index in the flow */
  index: PropTypes.number.isRequired,
  /** Whether animation is currently running */
  isAnimating: PropTypes.bool.isRequired,
  /** File chip click handler - receives file object and node */
  onFileClick: PropTypes.func,
  /** Whether to show compact version (for zoomed-out view) */
  compact: PropTypes.bool
};

export default FlowNode;
