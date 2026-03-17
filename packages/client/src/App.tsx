import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { UserModeProvider, useUserMode } from './contexts/UserModeContext';
import Layout from './components/Layout';
import ITAdminLayout from './components/ITAdminLayout';
import HomePage from './pages/HomePage';
import DataTablePage from './pages/DataTablePage';
import SearchPage from './pages/SearchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FileDetailsPage from './pages/FileDetailsPage';
import AppsPage from './pages/AppsPage';
import VisualizePage from './pages/VisualizePage';
import UploadPage from './pages/UploadPage';
import DashboardsPage from './pages/DashboardsPage';
import ITSearchPage from './pages/ITSearchPage';
import PersonaSelectPage from './pages/PersonaSelectPage';
import CRODataReviewPage from './pages/CRODataReviewPage';
import SignedReportPage from './pages/SignedReportPage';
import AuditTrailPage from './pages/AuditTrailPage';

function AppRoutes() {
  const { userMode } = useUserMode();

  return (
    <Routes>
      {/* Persona selection route */}
      <Route path="/select-persona" element={<PersonaSelectPage />} />

      {/* IT Admin routes */}
      {userMode === 'it' && (
        <Route path="/it" element={<ITAdminLayout />}>
          <Route index element={<ITSearchPage />} />
        </Route>
      )}

      {/* Scientist routes */}
      {userMode === 'scientist' && (
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="data-table" element={<DataTablePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search-results" element={<SearchResultsPage />} />
          <Route path="details/:id" element={<FileDetailsPage />} />
          <Route path="apps" element={<AppsPage />} />
          <Route path="apps/cro-data-review" element={<CRODataReviewPage />} />
          <Route path="apps/cro-data-review/report/:reportId" element={<SignedReportPage />} />
          <Route path="audit-trail" element={<AuditTrailPage />} />
          <Route path="visualize" element={<VisualizePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="dashboards" element={<DashboardsPage />} />
        </Route>
      )}

      {/* Default redirects based on user mode */}
      <Route path="*" element={
        userMode === null ? <Navigate to="/select-persona" replace /> :
        userMode === 'it' ? <Navigate to="/it" replace /> :
        <Navigate to="/" replace />
      } />
    </Routes>
  );
}

function App() {
  return (
    <UserModeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserModeProvider>
  );
}

export default App;