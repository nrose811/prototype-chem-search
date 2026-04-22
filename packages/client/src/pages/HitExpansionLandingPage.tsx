import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HitExpansionLanding.css';

type UseCase = 'latent-bridge' | 'radial';

function HitExpansionLandingPage() {
  const [selected, setSelected] = useState<UseCase>('latent-bridge');
  const navigate = useNavigate();

  return (
    <div className="he-landing">
      <Link to="/apps" className="he-back-link">&larr; Apps</Link>
      <h1 className="he-landing-title">Hit Expansion</h1>
      <p className="he-landing-subtitle">
        Explore chemical space with AI-powered molecular generation
      </p>

      <div className="he-use-cases">
        <button
          className={`he-use-case-card ${selected === 'latent-bridge' ? 'selected' : ''}`}
          onClick={() => setSelected('latent-bridge')}
        >
          <div className="he-uc-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="5" cy="12" r="3" />
              <circle cx="19" cy="12" r="3" />
              <line x1="8" y1="12" x2="16" y2="12" strokeDasharray="2 2" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h3>Latent Bridge</h3>
          <p>Interpolate between two anchor molecules in latent space to discover novel compounds along the path.</p>
        </button>

        <button
          className={`he-use-case-card ${selected === 'radial' ? 'selected' : ''}`}
          onClick={() => setSelected('radial')}
        >
          <div className="he-uc-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="4" r="1.5" />
              <circle cx="19" cy="8" r="1.5" />
              <circle cx="19" cy="16" r="1.5" />
              <circle cx="12" cy="20" r="1.5" />
              <circle cx="5" cy="16" r="1.5" />
              <circle cx="5" cy="8" r="1.5" />
            </svg>
          </div>
          <h3>Radial Expansion</h3>
          <p>Generate structurally similar compounds around a single pivot molecule with property-guided thresholds.</p>
        </button>
      </div>

      <button
        className="he-explore-btn"
        onClick={() => navigate(`/apps/hit-expansion/${selected}`)}
      >
        Explore {selected === 'latent-bridge' ? 'Latent Bridge' : 'Radial Expansion'}
      </button>
    </div>
  );
}

export default HitExpansionLandingPage;
