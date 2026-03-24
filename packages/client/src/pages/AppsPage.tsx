import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppsPage.css';

// Icon components
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const FlaskIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path>
    <path d="M8.5 2h7"></path>
    <path d="M7 16h10"></path>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const LineageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

interface App {
  id: string;
  icon: JSX.Element;
  title: string;
  description: string;
  version: string;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
  category: string[];
  isFavorite: boolean;
}

type FilterCategory = 'All Apps' | 'Favorite' | 'Featured' | 'Data' | 'AI' | 'Analytics' | 'Workflow';

const BeakerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 3h15"></path>
    <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"></path>
    <path d="M6 14h12"></path>
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <path d="m9 14 2 2 4-4"></path>
  </svg>
);

function AppsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All Apps');
  const navigate = useNavigate();

  const apps: App[] = [
    {
      id: 'cro-data-review',
      icon: <ClipboardCheckIcon />,
      title: 'CRO Data Review',
      description: 'Review CRO batch data, verify assay results, and apply e-signatures for approval',
      version: 'v1.4.0',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'Data', 'Featured'],
      isFavorite: true,
    },
    {
      id: 'hic-qc',
      icon: <BeakerIcon />,
      title: 'HIC QC Data',
      description: 'Review hydrophobic interaction chromatography QC data and apply e-signatures',
      version: 'v1.0.0',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'Data', 'Featured'],
      isFavorite: true,
    },
    {
      id: 'esign',
      icon: <ClipboardCheckIcon />,
      title: 'eSignature',
      description: 'Review source data alongside parsed results and apply 21 CFR Part 11 compliant e-signatures',
      version: 'v1.0.0',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'Data', 'Featured'],
      isFavorite: true,
    },
    {
      id: '4',
      icon: <LineageIcon />,
      title: 'Lineage Explorer',
      description: 'Visualize data lineage and trace experimental workflows across systems',
      version: 'v3.0',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'Data'],
      isFavorite: true,
    },
    {
      id: '2',
      icon: <ChartIcon />,
      title: 'Chromatography Insights',
      description: 'Analyze chromatography data with advanced visualization and statistical tools',
      version: 'v2.1',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'Analytics'],
      isFavorite: true,
    },
    {
      id: '3',
      icon: <UsersIcon />,
      title: 'Purification Insights',
      description: 'Track purification process and optimize experimental workflows',
      version: 'v1.7',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'Workflow', 'Featured'],
      isFavorite: false,
    },
    {
      id: '6',
      icon: <ChartIcon />,
      title: 'Data Quality Monitor',
      description: 'Monitor data quality metrics and identify potential issues automatically',
      version: 'v2.1',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'Data', 'Analytics', 'Featured'],
      isFavorite: false,
    },
    {
      id: '7',
      icon: <FlaskIcon />,
      title: 'ML Model Registry',
      description: 'Manage and deploy machine learning models for scientific applications',
      version: 'v1.7',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'AI'],
      isFavorite: false,
    },
    {
      id: '8',
      icon: <UsersIcon />,
      title: 'Experiment Designer',
      description: 'Design and plan experiments with AI-powered optimization suggestions',
      version: 'v1.7',
      buttonText: 'OPEN',
      buttonVariant: 'primary',
      category: ['All Apps', 'AI', 'Workflow', 'Featured'],
      isFavorite: false,
    },
  ];

  const filters: { label: FilterCategory; count: number }[] = [
    { label: 'All Apps', count: 8 },
    { label: 'Favorite', count: 4 },
    { label: 'Featured', count: 5 },
  ];

  const filteredApps = apps.filter(app => {
    if (activeFilter === 'All Apps') return true;
    if (activeFilter === 'Favorite') return app.isFavorite;
    return app.category.includes(activeFilter);
  });

  return (
    <div className="apps-page">
      <div className="apps-header">
        <div className="apps-filters">
          {filters.map((filter) => (
            <button
              key={filter.label}
              className={`apps-filter-btn ${activeFilter === filter.label ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.label)}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
        <div className="apps-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            className="apps-search-input"
          />
        </div>
      </div>

      <div className="apps-grid">
        {filteredApps.map((app) => (
          <div key={app.id} className="app-card">
            <div className="app-card-header">
              <div className="app-card-icon">{app.icon}</div>
              <div className="app-card-actions">
                <button className={`app-card-star-btn ${app.isFavorite ? 'favorite' : ''}`} aria-label="Favorite">
                  <StarIcon filled={app.isFavorite} />
                </button>
                <button className="app-card-menu-btn" aria-label="More options">
                  <MoreIcon />
                </button>
              </div>
            </div>
            <h3 className="app-card-title">{app.title}</h3>
            <p className="app-card-description">{app.description}</p>
            <div className="app-card-footer">
              <span className="app-card-version">{app.version}</span>
              <button
                className={`app-card-btn ${app.buttonVariant}`}
                onClick={() => {
                  if (app.id === 'cro-data-review') {
                    navigate('/apps/cro-data-review');
                  } else if (app.id === 'hic-qc') {
                    navigate('/apps/hic-qc');
                  } else if (app.id === 'esign') {
                    navigate('/apps/esign');
                  }
                }}
              >
                {app.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppsPage;

