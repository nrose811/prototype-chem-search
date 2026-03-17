import { useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './Toolbar.css';
import { useUserMode } from '../contexts/UserModeContext';

const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/data-table': 'My data',
  '/search': 'Search',
  '/search-results': 'Search results',
  '/apps': 'Apps',
  '/visualize': 'Visualize data',
  '/dashboards': 'Dashboards',
  '/upload': 'Upload',
};

interface ToolbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

function Toolbar({ isSidebarCollapsed, onToggleSidebar }: ToolbarProps) {
  const location = useLocation();
  const { userMode, toggleUserMode } = useUserMode();

  // Get the page title, checking for dynamic routes
  let title = pageTitles[location.pathname];
  if (!title) {
    // Check if it's a details page
    if (location.pathname.startsWith('/details/')) {
      title = 'Details';
    } else {
      title = 'Page';
    }
  }

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  // Mock organization data
  const currentOrg = {
    name: 'TetraScience Demo',
    slug: 'tetrascience-demo'
  };

  const organizations = [
    { name: 'TetraScience Demo', slug: 'tetrascience-demo' },
    { name: 'Research Lab Alpha', slug: 'research-lab-alpha' },
    { name: 'Test Org', slug: 'test-lab' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setIsOrgDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="toolbar">
      <div className="toolbar-content">
        <div className="toolbar-left">
          <button
            className="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>
          <h1 className="toolbar-title">{title}</h1>
        </div>
        <div className="toolbar-right">
          {/* Organization Selector */}
          <div className="org-selector-container" ref={orgDropdownRef}>
            <button
              className="org-selector-btn"
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              aria-label="Select organization"
            >
              <div className="org-selector-content">
                <div className="org-name">{currentOrg.name}</div>
                <div className="org-slug">{currentOrg.slug}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isOrgDropdownOpen && (
              <div className="org-dropdown">
                {organizations.map((org) => (
                  <button
                    key={org.slug}
                    className={`org-dropdown-item ${org.slug === currentOrg.slug ? 'active' : ''}`}
                    onClick={() => {
                      console.log('Selected org:', org);
                      setIsOrgDropdownOpen(false);
                    }}
                  >
                    <div className="org-dropdown-name">{org.name}</div>
                    <div className="org-dropdown-slug">{org.slug}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Help Icon */}
          <button
            className="toolbar-icon-btn"
            aria-label="Help"
            onClick={() => console.log('Help clicked')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>

          {/* Account Icon with Dropdown */}
          <div className="account-dropdown-container" ref={dropdownRef}>
            <button
              className="toolbar-icon-btn"
              aria-label="Account"
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {isAccountDropdownOpen && (
              <div className="account-dropdown">
                <div className="account-dropdown-header">
                  <div className="account-name">Marie Curie</div>
                  <div className="account-email">marie.curie@example.com</div>
                </div>
                <button className="account-dropdown-item" onClick={() => console.log('Profile clicked')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  My Account
                </button>
                <div className="account-dropdown-divider"></div>
                <button className="account-dropdown-item" onClick={() => {
                  toggleUserMode();
                  setIsAccountDropdownOpen(false);
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Switch to {userMode === 'scientist' ? 'IT' : 'Scientist'} Mode
                </button>
                <div className="account-dropdown-divider"></div>
                <button className="account-dropdown-item" onClick={() => console.log('Logout clicked')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  );
}

export default Toolbar;

