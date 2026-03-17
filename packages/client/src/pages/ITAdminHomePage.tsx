import { Link } from 'react-router-dom';
import './ITAdminHomePage.css';

// Icon components
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

interface CardItem {
  icon: JSX.Element;
  title: string;
  subtitle: string;
}

function ITAdminHomePage() {
  const recommendedApps: CardItem[] = [
    {
      icon: <StarIcon />,
      title: 'Chromatography insights',
      subtitle: 'v1.2',
    },
    {
      icon: <StarIcon />,
      title: 'Purification insights',
      subtitle: 'v2.1',
    },
    {
      icon: <GridIcon />,
      title: 'CRO Connect',
      subtitle: 'v1.3.8',
    },
  ];

  const savedSearches: CardItem[] = [
    {
      icon: <SearchIcon />,
      title: 'All data for proteomics study 3',
      subtitle: 'This morning',
    },
    {
      icon: <SearchIcon />,
      title: 'Mass spec data for Sample#97',
      subtitle: '3 months',
    },
    {
      icon: <SearchIcon />,
      title: 'All my data',
      subtitle: 'Last month',
    },
  ];

  const recentData: CardItem[] = [
    {
      icon: <GridIcon />,
      title: 'Data set',
      subtitle: 'Today',
    },
    {
      icon: <FileIcon />,
      title: 'File name',
      subtitle: 'Yesterday',
    },
    {
      icon: <FileIcon />,
      title: 'Excel file name',
      subtitle: 'Yesterday',
    },
  ];

  const renderSection = (title: string, items: CardItem[], viewAllLink: string) => (
    <div className="it-home-section">
      <h3 className="it-section-title">{title}</h3>
      <div className="it-section-card">
        {items.map((item, index) => (
          <div key={index} className="it-card-item">
            <div className="it-card-icon">{item.icon}</div>
            <div className="it-card-content">
              <div className="it-card-title">{item.title}</div>
              <div className="it-card-subtitle">{item.subtitle}</div>
            </div>
            <button className="it-card-menu" aria-label="More options">
              <MoreIcon />
            </button>
          </div>
        ))}
      </div>
      <Link to={viewAllLink} className="it-view-all-link">View all</Link>
    </div>
  );

  return (
    <div className="it-admin-home-page">
      <h1 className="it-welcome-title">Welcome, Marie Curie!</h1>

      <div className="it-home-sections">
        {renderSection('Recommended apps', recommendedApps, '/it/apps')}
        {renderSection('Saved searches', savedSearches, '/it/search')}
        {renderSection('Recent data', recentData, '/it/my-data')}
      </div>
    </div>
  );
}

export default ITAdminHomePage;

