import React from 'react';
import PropTypes from 'prop-types';

/**
 * Expandable panel displaying code examples for a selected node
 * Shows header with node info and a syntax-highlighted code block
 */
const CodePanel = ({ node }) => {
  if (!node) return null;

  return (
    <div className="code-panel">
      {/* Panel header with gradient background */}
      <header
        className="code-panel__header"
        style={{ backgroundColor: `${node.color}20` }}
      >
        <div className="code-panel__title-row">
          <span
            className="code-panel__indicator"
            style={{ backgroundColor: node.color }}
            aria-hidden="true"
          />
          <h2 className="code-panel__title">{node.label}</h2>
          <span className="code-panel__sublabel">— {node.sublabel}</span>
        </div>
        <p className="code-panel__explanation">{node.explanation}</p>
      </header>

      {/* Code block */}
      <div className="code-panel__body">
        <pre className="code-panel__pre">
          <code className="code-panel__code">
            {node.code}
          </code>
        </pre>
      </div>
    </div>
  );
};

CodePanel.propTypes = {
  /** The active node object containing code and explanation */
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sublabel: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired
  })
};

export default CodePanel;
