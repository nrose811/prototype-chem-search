import CustomCard from '../components/CustomCard';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Icon components
const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </svg>
);

const ExcelIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
    <path d="M9.5 14l1.5-2.5L9.5 9h1.75l.75 1.5.75-1.5h1.75L13 11.5l1.5 2.5h-1.75l-.75-1.5-.75 1.5H9.5z" />
  </svg>
);

const GridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
  </svg>
);

interface CardItem {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  link?: string;
}

function HomePage() {
  const pendingReviews: CardItem[] = [
    {
      icon: <ClipboardIcon />,
      title: 'CRO Alpha — Batch 42',
      subtitle: 'Pending Signature · 4 files · Received Mar 15',
      link: '/apps/cro-data-review',
    },
  ];

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
      link: '/search-results',
    },
    {
      icon: <SearchIcon />,
      title: 'Mass spec data for Sample#97',
      subtitle: '3 months',
      link: '/search-results',
    },
    {
      icon: <SearchIcon />,
      title: 'All my data',
      subtitle: 'Last month',
      link: '/search-results',
    },
  ];

  const recentData: CardItem[] = [
    {
      icon: <FileIcon />,
      title: 'CRO-Alpha-Potency-Assay-Batch42.json',
      subtitle: 'GxP Signed · Today',
      link: '/details/file-001',
    },
    {
      icon: <GridIcon />,
      title: 'Data set',
      subtitle: 'Today',
      link: '/details/1',
    },
    {
      icon: <FileIcon />,
      title: 'File name',
      subtitle: 'Yesterday',
      link: '/details/2',
    },
    {
      icon: <ExcelIcon />,
      title: 'Excel file name',
      subtitle: 'Yesterday',
      link: '/details/3',
    },
  ];

  const renderSection = (title: string, items: CardItem[], viewAllLink: string) => (
    <div className="home-section">
      <div className="section-header">
        <h3>{title}</h3>
      </div>
      <CustomCard className="section-card">
        <div className="section-card-content">
          {items.map((item, index) => {
            const content = (
              <>
                <div className="card-icon">{item.icon}</div>
                <div className="card-text">
                  <div className="card-title">{item.title}</div>
                  <div className="card-subtitle">{item.subtitle}</div>
                </div>
                <button className="card-menu-btn" aria-label="More options">
                  <MoreIcon />
                </button>
              </>
            );

            return item.link ? (
              <Link key={index} to={item.link} className="list-item list-item-link">
                {content}
              </Link>
            ) : (
              <div key={index} className="list-item">
                {content}
              </div>
            );
          })}
        </div>
      </CustomCard>
      <Link to={viewAllLink} className="view-all-link">View all</Link>
    </div>
  );

  return (
    <div className="home-page">
      <h1 className="welcome-title">Welcome, Marie Curie!</h1>

      <div className="home-sections">
        {renderSection('Pending reviews', pendingReviews, '/apps/cro-data-review')}
        {renderSection('Recommended apps', recommendedApps, '/apps')}
        {renderSection('Recent data', recentData, '/data-table')}
      </div>
    </div>
  );
}

export default HomePage;

