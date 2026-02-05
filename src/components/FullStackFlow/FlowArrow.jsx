import React from 'react';
import PropTypes from 'prop-types';

/**
 * Arrow connector between flow nodes
 * Simple presentational component that shows directional flow
 */
const FlowArrow = ({ isVisible = true }) => {
  return (
    <div
      className={`flow-arrow ${isVisible ? '' : 'flow-arrow--hidden'}`}
      aria-hidden="true"
    >
      <span className="flow-arrow__line" />
      <span className="flow-arrow__head" />
    </div>
  );
};

FlowArrow.propTypes = {
  /** Whether the arrow should be fully visible */
  isVisible: PropTypes.bool
};

export default FlowArrow;
