import { useState, useRef, useEffect } from 'react';
import { useUserMode } from '../contexts/UserModeContext';
import './ITToolbar.css';
import './Toolbar.css';

function ITToolbar() {
  const { toggleUserMode } = useUserMode();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="it-toolbar">
      <div className="it-toolbar-left">
        <div className="it-toolbar-section">
          <span className="it-toolbar-label">ORGANIZATION</span>
          <div className="it-toolbar-org">
            <span className="it-toolbar-org-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </span>
            <div className="it-toolbar-org-details">
              <span className="it-toolbar-org-name">Tetrascience</span>
              <span className="it-toolbar-org-slug">tetrascience</span>
            </div>
          </div>
        </div>
        <div className="it-toolbar-section">
          <span className="it-toolbar-label">PROJECT</span>
          <div className="it-toolbar-project">
            <span className="it-toolbar-project-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L12 6"></path>
                <circle cx="12" cy="14" r="8"></circle>
              </svg>
            </span>
            <span className="it-toolbar-project-name">(not selected)</span>
          </div>
        </div>
      </div>
      <div className="it-toolbar-right">
        <button className="it-toolbar-help" title="Help">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
        <div className="account-dropdown-container" ref={dropdownRef}>
          <button
            className="it-toolbar-account-button"
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          {isAccountMenuOpen && (
            <div className="account-dropdown">
              <div className="account-dropdown-header">
                <div className="account-name">Marie Curie</div>
                <div className="account-email">marie.curie@example.com</div>
              </div>
              <button className="account-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Account
              </button>
              <div className="account-dropdown-divider"></div>
              <button className="account-dropdown-item" onClick={toggleUserMode}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Switch to Scientist Mode
              </button>
              <div className="account-dropdown-divider"></div>
              <button className="account-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ITToolbar;

