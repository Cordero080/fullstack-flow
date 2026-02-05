import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing the flow animation state
 * Handles the step-by-step animation through all nodes
 *
 * @param {number} nodeCount - Total number of nodes to animate through
 * @param {number} stepDuration - Duration in ms between animation steps (default: 800ms)
 * @returns {Object} Animation state and control functions
 */
const useFlowAnimation = (nodeCount, stepDuration = 800) => {
  const [animating, setAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(-1);

  /**
   * Start the animation from the beginning
   */
  const runAnimation = useCallback(() => {
    setAnimating(true);
    setAnimationStep(0);
  }, []);

  /**
   * Reset animation to initial state
   */
  const resetAnimation = useCallback(() => {
    setAnimating(false);
    setAnimationStep(-1);
  }, []);

  /**
   * Handle animation progression
   * Advances through each step with a timeout
   */
  useEffect(() => {
    if (animating && animationStep < nodeCount) {
      const timer = setTimeout(() => {
        setAnimationStep((prev) => prev + 1);
      }, stepDuration);

      // Cleanup timeout on unmount or when dependencies change
      return () => clearTimeout(timer);
    } else if (animationStep >= nodeCount) {
      // Animation complete
      setAnimating(false);
    }
  }, [animating, animationStep, nodeCount, stepDuration]);

  return {
    animating,
    animationStep,
    runAnimation,
    resetAnimation,
  };
};

export default useFlowAnimation;
