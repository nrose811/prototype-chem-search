import { Outlet } from 'react-router-dom';
import './ITAdminLayout.css';
import ITToolbar from './ITToolbar';
import ITAdminSidebar from './ITAdminSidebar';

// Define sidebar items for IT admin - matching production UI (display only, not clickable)
const itSidebarItems = [
  { icon: 'search', label: 'Search' },
  { icon: 'sqlsearch', label: 'SQL Search' },
  { icon: 'projects', label: 'Projects' },
  { icon: 'pipelines', label: 'Pipelines' },
  { icon: 'workspace', label: 'Data & AI Workspace' },
  { icon: 'artifacts', label: 'Artifacts' },
  { icon: 'datasources', label: 'Data Sources' },
  { icon: 'intelligence', label: 'Operational Intelligence' },
  { icon: 'bulkactions', label: 'Bulk Actions' },
  { icon: 'attributemanagement', label: 'Attribute Management' },
  { icon: 'administration', label: 'Administration' },
];

function ITAdminLayout() {
  return (
    <div className="it-admin-layout">
      {/* IT Admin Sidebar */}
      <ITAdminSidebar items={itSidebarItems} />

      {/* Main Content */}
      <div className="it-admin-main-content">
        <ITToolbar />
        <div className="it-admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ITAdminLayout;

