import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  getFileInfo,
  getUserRecentFiles,
  formatBytes,
  formatDate,
  categoryColor,
  type ChemFileRecord,
} from '../mocks/chemSearchData';
import ChemFileLineageDrawer from '../components/ChemFileLineageDrawer';
import './ChemSearchPage.css';

type Tab = 'file-info' | 'my-files';

function ChemSearchPage() {
  const [activeTab, setActiveTab] = useState<Tab>('file-info');

  return (
    <div className="chem-search-page">
      <div className="chem-header">
        <Link to="/apps" className="chem-back-link">&larr; Apps</Link>
        <h1>Chem Search</h1>
        <p className="chem-subtitle">Browse files, view lineage, and preview IDS data</p>
      </div>

      <div className="chem-tabs">
        <button
          className={`chem-tab ${activeTab === 'file-info' ? 'active' : ''}`}
          onClick={() => setActiveTab('file-info')}
        >
          File Info
        </button>
        <button
          className={`chem-tab ${activeTab === 'my-files' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-files')}
        >
          My Files
        </button>
      </div>

      {activeTab === 'file-info' ? <FileInfoView /> : <MyFilesView />}
    </div>
  );
}

// ── File Info (paginated table) ──────────────────────────────
function FileInfoView() {
  const [page, setPage] = useState(1);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const pageSize = 10;

  const { files, total } = useMemo(() => getFileInfo(page, pageSize), [page]);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <div className="chem-table-container">
        <table className="chem-table">
          <thead>
            <tr>
              <th style={{ width: '35%' }}>File Path</th>
              <th style={{ width: '10%' }}>Category</th>
              <th style={{ width: '15%' }}>Source Type</th>
              <th style={{ width: '18%' }}>Source Name</th>
              <th style={{ width: '14%', textAlign: 'center' }}>Created</th>
              <th style={{ width: '8%', textAlign: 'right' }}>Size</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <FileRow
                key={f.fileId}
                file={f}
                isSelected={f.fileId === selectedFileId}
                onClick={() => setSelectedFileId(f.fileId)}
              />
            ))}
          </tbody>
        </table>

        <div className="chem-pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {totalPages} ({total} files)</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>

      {selectedFileId && (
        <ChemFileLineageDrawer
          fileId={selectedFileId}
          onClose={() => setSelectedFileId(null)}
        />
      )}
    </>
  );
}

// ── My Files view ────────────────────────────────────────────
function MyFilesView() {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const { files, user } = useMemo(() => getUserRecentFiles(), []);

  return (
    <>
      <div className="chem-my-files-header">
        <span className="chem-user-greeting">Welcome back, <strong>{user.name}</strong></span>
        <span className="chem-my-files-subtitle">Your 5 most recent RAW files</span>
      </div>

      <div className="chem-table-container">
        <table className="chem-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>File Path</th>
              <th style={{ width: '10%' }}>Category</th>
              <th style={{ width: '18%' }}>Source Name</th>
              <th style={{ width: '16%', textAlign: 'center' }}>Created</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Size</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f: ChemFileRecord) => (
              <FileRow
                key={f.fileId}
                file={f}
                isSelected={f.fileId === selectedFileId}
                onClick={() => setSelectedFileId(f.fileId)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedFileId && (
        <ChemFileLineageDrawer
          fileId={selectedFileId}
          onClose={() => setSelectedFileId(null)}
        />
      )}
    </>
  );
}

// ── Shared file row ──────────────────────────────────────────
function FileRow({
  file,
  isSelected,
  onClick,
}: {
  file: ChemFileRecord;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <tr
      className={`chem-row ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <td className="chem-cell-path" title={file.filePath}>
        {file.filePath}
      </td>
      <td>
        <span
          className="chem-category-badge"
          style={{ background: categoryColor(file.category) }}
        >
          {file.category}
        </span>
      </td>
      <td>{file.sourceType}</td>
      <td>{file.sourceName}</td>
      <td style={{ textAlign: 'center' }}>{formatDate(file.createdAt)}</td>
      <td style={{ textAlign: 'right' }}>{formatBytes(file.size)}</td>
    </tr>
  );
}

export default ChemSearchPage;
