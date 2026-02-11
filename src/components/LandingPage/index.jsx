import './LandingPage.scss';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="landing">
      <h1 className="landing__title">Full-Stack Data Flow</h1>
      <button className="landing__enter" onClick={onEnter}>
        Enter
      </button>
    </div>
  );
};

export default LandingPage;
