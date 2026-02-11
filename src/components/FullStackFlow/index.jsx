import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { flowNodes } from '../../data/flowNodes';
import useFlowAnimation from '../../hooks/useFlowAnimation';
import Button from '../ui/Button';
import FlowNode from './FlowNode';
import FlowArrow from './FlowArrow';
import CodePanel from './CodePanel';
import DataFormatLabels from './DataFormatLabels';
import FlowLegend from './FlowLegend';
import FileDetailModal from './FileDetailModal';
import AboutModal from './AboutModal';
import './FullStackFlow.scss';

/**
 * FullStackFlow - Interactive visualization of full-stack data flow
 * Shows how data travels from user click through frontend, backend, database and back
 */
const FullStackFlow = ({ onHome }) => {
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileNode, setSelectedFileNode] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  
  const {
    animating,
    animationStep,
    runAnimation
  } = useFlowAnimation(flowNodes.length);

  /**
   * Toggle node selection
   */
  const handleNodeClick = (nodeId) => {
    setActiveNodeId(activeNodeId === nodeId ? null : nodeId);
  };

  /**
   * Handle file chip click - show file detail modal
   */
  const handleFileClick = (file, node) => {
    setSelectedFile(file);
    setSelectedFileNode(node);
  };

  /**
   * Close file detail modal
   */
  const handleCloseFileModal = () => {
    setSelectedFile(null);
    setSelectedFileNode(null);
  };

  /**
   * Get the currently active node object
   */
  const activeNode = flowNodes.find(node => node.id === activeNodeId) || null;

  /**
   * Determine if an arrow should be visible based on animation state
   */
  const isArrowVisible = (index) => {
    if (!animating) return true;
    return animationStep > index;
  };

  return (
    <div className="fullstack-flow">
      {/* Info button - top left */}
      <button 
        className="fullstack-flow__info-btn"
        onClick={() => setShowAbout(true)}
        aria-label="About this app"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>

      {/* Home button - top right */}
      <button 
        className="fullstack-flow__home-btn"
        onClick={onHome}
        aria-label="Back to home"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      <div className="fullstack-flow__container">
        {/* Header Section */}
        <header className="fullstack-flow__header">
          <h1 className="fullstack-flow__title">
            Full-Stack Data Flow
          </h1>
          <p className="fullstack-flow__subtitle">
            Click any node to see the code at that step
          </p>
          <Button
            onClick={runAnimation}
            disabled={animating}
            variant="primary"
            size="medium"
          >
            {animating ? 'Animating...' : '▶ Animate Flow'}
          </Button>
        </header>

        {/* Flow Diagram */}
        <section className="flow-diagram" aria-label="Data flow diagram">
          <div className="flow-diagram__nodes">
            {flowNodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <FlowNode
                  node={node}
                  isActive={activeNodeId === node.id}
                  onClick={handleNodeClick}
                  animationStep={animationStep}
                  index={index}
                  isAnimating={animating}
                  onFileClick={handleFileClick}
                />
                
                {/* Arrow between nodes (not after the last one) */}
                {index < flowNodes.length - 1 && (
                  <FlowArrow isVisible={isArrowVisible(index)} />
                )}
              </React.Fragment>
            ))}
            
            {/* Cycle indicator - shows the flow repeats */}
            <div className={`flow-cycle-indicator ${animating && animationStep < flowNodes.length ? 'flow-cycle-indicator--hidden' : ''}`}>
              <span className="flow-cycle-indicator__arrow">↻</span>
              <span className="flow-cycle-indicator__text">Cycle Repeats</span>
            </div>
          </div>

          {/* Data Format Labels */}
          <DataFormatLabels
            isAnimating={animating}
            animationStep={animationStep}
          />
        </section>

        {/* Code Panel - shows when a node is selected */}
        {activeNode && (
          <section aria-label="Code example">
            <CodePanel node={activeNode} />
          </section>
        )}

        {/* Legend */}
        <FlowLegend />

        {/* Footer */}
        <footer className="fullstack-flow__footer">
          <p>Built for understanding full-stack architecture • NUMENEON style 🌊</p>
        </footer>
      </div>

      {/* File Detail Modal */}
      {selectedFile && (
        <FileDetailModal
          file={selectedFile}
          node={selectedFileNode}
          onClose={handleCloseFileModal}
        />
      )}

      {/* About Modal */}
      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}
    </div>
  );
};

FullStackFlow.propTypes = {
  onHome: PropTypes.func.isRequired,
};

export default FullStackFlow;
