import { useNavigate } from 'react-router-dom';
import { useUserMode } from '../contexts/UserModeContext';
import './PersonaSelectPage.css';

function PersonaSelectPage() {
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();

  const handlePersonaSelect = (mode: 'scientist' | 'it') => {
    setUserMode(mode);
    navigate(mode === 'it' ? '/it' : '/');
  };

  return (
    <div className="persona-select-page">
      <div className="persona-select-container">
        <img src="/logo.svg" alt="TetraScience" className="persona-logo" />
        <h1 className="persona-title">Choose your workspace</h1>
        <p className="persona-subtitle">What do you want to do today?</p>

        <div className="persona-cards">
          <button
            className="persona-card"
            onClick={() => handlePersonaSelect('scientist')}
          >
            <div className="persona-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3h6v5l4 9H5l4-9V3z"></path>
                <path d="M9 3h6"></path>
                <path d="M10 12h4"></path>
              </svg>
            </div>
            <h2 className="persona-card-title">Work with scientific data</h2>
            <p className="persona-card-description">
              Search, explore and analyze scientific data
            </p>
          </button>

          <button
            className="persona-card"
            onClick={() => handlePersonaSelect('it')}
          >
            <div className="persona-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <h2 className="persona-card-title">Build and manage</h2>
            <p className="persona-card-description">
              Manage platform settings, users and system configuration
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonaSelectPage;

