import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import FullStackFlow from './components/FullStackFlow';
import './styles/global.scss';

/**
 * Root application component
 */
const App = () => {
  // Start directly on FullStackFlow
  const [showApp, setShowApp] = useState(true);

  // Persist state to localStorage
  useEffect(() => {
    if (showApp) {
      localStorage.setItem('fullstack-flow-entered', 'true');
    }
  }, [showApp]);

  // Handle going back to landing
  const handleBackToLanding = () => {
    localStorage.removeItem('fullstack-flow-entered');
    setShowApp(false);
  };

  return (
    <main>
      {showApp ? (
        <FullStackFlow onHome={handleBackToLanding} />
      ) : (
        <LandingPage onEnter={() => setShowApp(true)} />
      )}
    </main>
  );
};

export default App;
