import React from 'react';
import PropTypes from 'prop-types';

/**
 * Row of labels showing the data format at each stage
 * Displays HTTP Request, JSON/REST, SQL Query, etc.
 */
const DataFormatLabels = ({ isAnimating = false, animationStep = -1 }) => {
  const labels = [
    { color: 'purple', label: 'HTTP Request', visibleAfter: 2 },
    { color: 'pink', label: 'JSON/REST', visibleAfter: 3 },
    { color: 'red', label: 'SQL Query', visibleAfter: 4 },
    { color: 'yellow', label: 'JSON Response', visibleAfter: 6 },
    { color: 'green', label: 'DOM Update', visibleAfter: 8 }
  ];

  const isLabelVisible = (visibleAfter) => {
    if (!isAnimating) return true;
    return animationStep >= visibleAfter;
  };

  return (
    <div className="data-format-labels">
      {/* Spacers for alignment with first two nodes */}
      <div className="data-format-labels__spacer" />
      <div className="data-format-labels__spacer" />

      {/* HTTP Request label */}
      <div
        className={`data-format-labels__item data-format-labels__item--purple ${
          isLabelVisible(labels[0].visibleAfter) ? '' : 'data-format-labels__item--hidden'
        }`}
      >
        <span className="data-format-labels__arrow">→</span>
        <span className="data-format-labels__badge data-format-labels__badge--purple">
          {labels[0].label}
        </span>
      </div>

      {/* JSON/REST label */}
      <div
        className={`data-format-labels__item data-format-labels__item--pink ${
          isLabelVisible(labels[1].visibleAfter) ? '' : 'data-format-labels__item--hidden'
        }`}
      >
        <span className="data-format-labels__arrow">→</span>
        <span className="data-format-labels__badge data-format-labels__badge--pink">
          {labels[1].label}
        </span>
      </div>

      {/* SQL Query label */}
      <div
        className={`data-format-labels__item data-format-labels__item--red ${
          isLabelVisible(labels[2].visibleAfter) ? '' : 'data-format-labels__item--hidden'
        }`}
      >
        <span className="data-format-labels__arrow">→</span>
        <span className="data-format-labels__badge data-format-labels__badge--red">
          {labels[2].label}
        </span>
      </div>

      {/* Spacer for database response node */}
      <div className="data-format-labels__spacer" />

      {/* JSON Response label */}
      <div
        className={`data-format-labels__item data-format-labels__item--yellow ${
          isLabelVisible(labels[3].visibleAfter) ? '' : 'data-format-labels__item--hidden'
        }`}
      >
        <span className="data-format-labels__arrow">→</span>
        <span className="data-format-labels__badge data-format-labels__badge--yellow">
          {labels[3].label}
        </span>
      </div>

      {/* DOM Update label */}
      <div
        className={`data-format-labels__item data-format-labels__item--green ${
          isLabelVisible(labels[4].visibleAfter) ? '' : 'data-format-labels__item--hidden'
        }`}
      >
        <span className="data-format-labels__arrow">→</span>
        <span className="data-format-labels__badge data-format-labels__badge--green">
          {labels[4].label}
        </span>
      </div>
    </div>
  );
};

DataFormatLabels.propTypes = {
  /** Whether animation is running (affects visibility) */
  isAnimating: PropTypes.bool,
  /** Current animation step */
  animationStep: PropTypes.number
};

export default DataFormatLabels;
