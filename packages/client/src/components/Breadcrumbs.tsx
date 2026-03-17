import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  'data-table': 'My data',
  'search': 'Search',
  'search-results': 'Search',
  'apps': 'Apps',
  'ui-components': 'UI components',
  'details': 'Details',
  'visualize': 'Visualize data',
  'dashboards': 'Dashboards',
  'upload': 'Upload',
};

// Special breadcrumb paths for routes that need custom parent paths
const customBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  '/search-results': [
    { label: 'Home', path: '/' },
    { label: 'Search', path: '/search' },
    { label: 'Results', path: '/search-results' },
  ],
};

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  // Check if this is a details page (starts with /details/)
  if (pathnames[0] === 'details') {
    const breadcrumbs = [
      { label: 'Home', path: '/' },
      { label: 'Search', path: '/search' },
      { label: 'Results', path: '/search-results' },
      { label: 'Details', path: location.pathname },
    ];

    return (
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={crumb.path} className="breadcrumb-item">
                {!isLast ? (
                  <>
                    <Link to={crumb.path} className="breadcrumb-link">
                      {crumb.label}
                    </Link>
                    <span className="breadcrumb-separator" aria-hidden="true">
                      /
                    </span>
                  </>
                ) : (
                  <span className="breadcrumb-current" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  // Check if this route has custom breadcrumbs
  if (customBreadcrumbs[location.pathname]) {
    const breadcrumbs = customBreadcrumbs[location.pathname];

    return (
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={crumb.path} className="breadcrumb-item">
                {!isLast ? (
                  <>
                    <Link to={crumb.path} className="breadcrumb-link">
                      {crumb.label}
                    </Link>
                    <span className="breadcrumb-separator" aria-hidden="true">
                      /
                    </span>
                  </>
                ) : (
                  <span className="breadcrumb-current" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
  ];

  // Build breadcrumb trail
  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment;
    breadcrumbs.push({ label, path: currentPath });
  });

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.path} className="breadcrumb-item">
              {!isLast ? (
                <>
                  <Link to={crumb.path} className="breadcrumb-link">
                    {crumb.label}
                  </Link>
                  <span className="breadcrumb-separator" aria-hidden="true">
                    /
                  </span>
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

