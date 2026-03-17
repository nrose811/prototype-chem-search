import { useNavigate, useLocation } from 'react-router-dom';
import './CustomSidebar.css';
import manifest from '../../../../manifest.json';

interface SidebarItem {
  icon: string;
  label: string;
  path: string;
}

interface CustomSidebarProps {
  items: SidebarItem[];
  isCollapsed?: boolean;
}

// Icon mapping - using solid SVG icons
const iconMap: Record<string, JSX.Element> = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
  ),
  database: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
    </svg>
  ),
  pencil: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
      <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
    </svg>
  ),
  'pie-chart': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      <path d="M13 3v9h9c0-4.97-4.03-9-9-9z"/>
    </svg>
  ),
  cube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" />
    </svg>
  ),
  apps: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h2v8H3v-8zm6-6h2v14H9V7zm6 3h2v11h-2V10zm6-7h2v18h-2V3z" />
    </svg>
  ),
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M7 14l3-3 3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
      <circle cx="10" cy="11" r="1.5" fill="currentColor"/>
      <circle cx="13" cy="14" r="1.5" fill="currentColor"/>
      <circle cx="18" cy="9" r="1.5" fill="currentColor"/>
    </svg>
  ),
};

function CustomSidebar({ items, isCollapsed = false }: CustomSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const logoSrc = '/logo.svg';
  const iconSrc = `/${manifest.icon.replace('images/', '')}`;

  return (
    <nav className={`custom-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {!isCollapsed ? (
        <div className="sidebar-header" onClick={() => handleClick('/')} role="button" tabIndex={0}>
          <img src={logoSrc} alt={manifest.name} className="sidebar-logo" />
        </div>
      ) : (
        <div className="sidebar-header-collapsed" onClick={() => handleClick('/')} role="button" tabIndex={0}>
          <img src={iconSrc} alt={manifest.name} className="sidebar-icon" />
        </div>
      )}
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            className={`sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => handleClick(item.path)}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="sidebar-item-icon">
              {iconMap[item.icon] || iconMap.home}
            </span>
            {!isCollapsed && (
              <span className="sidebar-item-label">{item.label}</span>
            )}
          </button>
        );
      })}
      {!isCollapsed && (
        <div className="sidebar-version">
          version {manifest.version.replace(/^v/, '')}
        </div>
      )}
    </nav>
  );
}

export default CustomSidebar;

