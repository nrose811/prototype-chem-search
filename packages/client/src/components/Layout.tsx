import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';
import Toolbar from './Toolbar';
import SecondaryToolbar from './SecondaryToolbar';
import CustomSidebar from './CustomSidebar';
import { ToolbarProvider, useToolbar } from '../contexts/ToolbarContext';

// Define sidebar items based on the app's routes
// Using IconName enum values from the TetraScience Toolkit
const sidebarItems = [
  {
    icon: 'home',
    label: 'Home',
    path: '/',
  },
  {
    icon: 'database',
    label: 'My data',
    path: '/data-table',
  },
  {
    icon: 'search',
    label: 'Search',
    path: '/search',
  },
  {
    icon: 'apps',
    label: 'Apps',
    path: '/apps',
  },
  {
    icon: 'chart',
    label: 'Visualize data',
    path: '/visualize',
  },
  {
    icon: 'dashboard',
    label: 'Dashboards',
    path: '/dashboards',
  },
];

function LayoutContent() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { rightActions } = useToolbar();

  // Check if we're on mobile (only phones, not tablets)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse sidebar on tablet breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 480 && window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="layout-container">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobile && isMobileMenuOpen ? 'mobile-open' : ''} ${isMobile && !isMobileMenuOpen ? 'mobile-closed' : ''}`}>
        <CustomSidebar items={sidebarItems} isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Toolbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        {location.pathname !== '/' && <SecondaryToolbar rightActions={rightActions} />}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <ToolbarProvider>
      <LayoutContent />
    </ToolbarProvider>
  );
}

export default Layout;

