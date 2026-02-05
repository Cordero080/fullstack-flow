import React from 'react';
import { legendItems } from '../../data/flowNodes';

/**
 * Legend component explaining the different data flow paths
 * Shows request path, response path, and data format transformations
 */
const FlowLegend = () => {
  return (
    <div className="flow-legend">
      <h3 className="flow-legend__title">The Journey of Data</h3>
      
      <div className="flow-legend__grid">
        {legendItems.map((item) => (
          <div key={item.title} className="flow-legend__item">
            <span
              className={`flow-legend__dot flow-legend__dot--${item.color}`}
              aria-hidden="true"
            />
            <div className="flow-legend__content">
              <span className={`flow-legend__label flow-legend__label--${item.color}`}>
                {item.title}
              </span>
              <p className="flow-legend__description">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowLegend;
