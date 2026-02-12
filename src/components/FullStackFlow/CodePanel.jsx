import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple syntax highlighter using color psychology for focus/retention
 * Colors chosen for calming yet stimulating effect on hyperactive minds:
 * - Cerulean Blue: Keywords (calming, focus)
 * - Coral/Red: Functions (attention, action)
 * - Gold/Amber: Strings (warmth, completion)
 * - Sage Green: Comments (rest, context)
 * - Soft Purple: Numbers (subtle distinction)
 */
const highlightCode = (code) => {
  if (!code) return '';
  
  // Escape HTML first
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Comments (both // and # for Python) - Sage Green for rest/context
  highlighted = highlighted.replace(
    /(\/\/.*$|#(?!{).*$)/gm,
    '<span class="syntax-comment">$1</span>'
  );
  
  // Multi-line comments /* */ 
  highlighted = highlighted.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span class="syntax-comment">$1</span>'
  );
  
  // Strings (single and double quotes, template literals) - Gold for warmth/completion
  highlighted = highlighted.replace(
    /(`[\s\S]*?`|"[^"]*"|'[^']*')/g,
    '<span class="syntax-string">$1</span>'
  );
  
  // Keywords - Cerulean Blue for calming focus (excluding 'class' to avoid breaking HTML)
  const keywords = /\b(const|let|var|function|async|await|return|if|else|try|catch|finally|throw|new|import|export|from|default|extends|this|super|static|get|set|typeof|instanceof|in|of|for|while|do|switch|case|break|continue|def|self|True|False|None|and|or|not|is|lambda|with|as|yield|raise|except|pass|assert|global|nonlocal|del)\b/g;
  highlighted = highlighted.replace(
    keywords,
    '<span class="syntax-keyword">$1</span>'
  );
  
  // Function calls - Coral Red for attention/action
  highlighted = highlighted.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
    '<span class="syntax-function">$1</span>('
  );
  
  // Method calls after dot
  highlighted = highlighted.replace(
    /\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
    '.<span class="syntax-function">$1</span>('
  );
  
  // Numbers - Soft Purple for subtle distinction
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="syntax-number">$1</span>'
  );
  
  // Object properties/keys before colon
  highlighted = highlighted.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g,
    '<span class="syntax-property">$1</span>:'
  );
  
  // Arrow functions
  highlighted = highlighted.replace(
    /=&gt;/g,
    '<span class="syntax-arrow">=&gt;</span>'
  );
  
  // Decorators (@something) - Python
  highlighted = highlighted.replace(
    /@([a-zA-Z_][a-zA-Z0-9_]*)/g,
    '<span class="syntax-decorator">@$1</span>'
  );
  
  return highlighted;
};

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

      {/* Code block with syntax highlighting */}
      <div className="code-panel__body">
        <pre className="code-panel__pre">
          <code 
            className="code-panel__code"
            dangerouslySetInnerHTML={{ __html: highlightCode(node.code) }}
          />
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
