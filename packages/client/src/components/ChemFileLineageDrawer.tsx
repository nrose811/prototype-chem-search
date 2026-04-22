import { useState, useMemo } from 'react';
import {
  getFileLineage,
  formatBytes,
  formatDate,
  categoryColor,
  type LineageFile,
} from '../mocks/chemSearchData';
import './ChemFileLineageDrawer.css';

interface Props {
  fileId: string;
  onClose: () => void;
}

type DrawerTab = 'lineage' | 'data';

function ChemFileLineageDrawer({ fileId, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('lineage');
  const [selectedLineageFileId, setSelectedLineageFileId] = useState<string | null>(null);

  const lineage = useMemo(() => getFileLineage(fileId), [fileId]);
  if (!lineage) return null;

  const { file, related } = lineage;
  const allFiles = [file, ...related].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // File shown in detail card — either selected lineage file or main file
  const detailFile = selectedLineageFileId
    ? allFiles.find((f) => f.fileId === selectedLineageFileId) ?? file
    : file;

  const hasIdsData = allFiles.some((f) => f.data);

  return (
    <div className="chem-drawer-overlay" onClick={onClose}>
      <div className="chem-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chem-drawer-header">
          <h2>File Details</h2>
          <button className="chem-drawer-close" onClick={onClose}>&times;</button>
        </div>

        {/* Detail card */}
        <FileDetailCard file={detailFile} />

        {/* Tabs */}
        <div className="chem-drawer-tabs">
          <button
            className={`chem-drawer-tab ${activeTab === 'lineage' ? 'active' : ''}`}
            onClick={() => setActiveTab('lineage')}
          >
            Lineage ({allFiles.length})
          </button>
          {hasIdsData && (
            <button
              className={`chem-drawer-tab ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              Data Preview
            </button>
          )}
        </div>

        {/* Tab content */}
        <div className="chem-drawer-body">
          {activeTab === 'lineage' ? (
            <LineageTimeline
              files={allFiles}
              selectedId={selectedLineageFileId ?? fileId}
              onSelect={setSelectedLineageFileId}
            />
          ) : (
            <DataPreview files={allFiles} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Detail card ──────────────────────────────────────────────
function FileDetailCard({ file }: { file: LineageFile }) {
  const fileName = file.filePath.split('/').pop() ?? file.filePath;

  return (
    <div className="chem-detail-card">
      <div className="chem-detail-top">
        <span
          className="chem-category-badge"
          style={{ background: categoryColor(file.category) }}
        >
          {file.category}
        </span>
        <span className="chem-detail-filename" title={file.filePath}>{fileName}</span>
      </div>
      <div className="chem-detail-path">{file.filePath}</div>
      <div className="chem-detail-grid">
        <div className="chem-detail-item">
          <span className="chem-detail-label">Size</span>
          <span className="chem-detail-value">{formatBytes(file.size)}</span>
        </div>
        <div className="chem-detail-item">
          <span className="chem-detail-label">Created</span>
          <span className="chem-detail-value">{formatDate(file.createdAt)}</span>
        </div>
        {file.sourceName && (
          <div className="chem-detail-item">
            <span className="chem-detail-label">Source</span>
            <span className="chem-detail-value">{file.sourceName}</span>
          </div>
        )}
        {file.integration && (
          <div className="chem-detail-item">
            <span className="chem-detail-label">Integration</span>
            <span className="chem-detail-value">{file.integration.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Lineage timeline ─────────────────────────────────────────
function LineageTimeline({
  files,
  selectedId,
  onSelect,
}: {
  files: LineageFile[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="chem-lineage-list">
      {files.map((f, i) => (
        <div key={f.fileId} className="chem-lineage-item-wrapper">
          {/* Connector line */}
          {i > 0 && <div className="chem-lineage-connector" />}

          <button
            className={`chem-lineage-item ${f.fileId === selectedId ? 'selected' : ''}`}
            onClick={() => onSelect(f.fileId)}
          >
            <span
              className="chem-lineage-dot"
              style={{ background: categoryColor(f.category) }}
            />
            <div className="chem-lineage-info">
              <span className="chem-lineage-category">{f.category}</span>
              <span className="chem-lineage-path" title={f.filePath}>
                {f.filePath.split('/').pop()}
              </span>
              <span className="chem-lineage-meta">
                {formatDate(f.createdAt)} &middot; {formatBytes(f.size)}
              </span>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Data preview (JSON) ──────────────────────────────────────
function DataPreview({ files }: { files: LineageFile[] }) {
  const idsFiles = files.filter((f) => f.data);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = idsFiles[selectedIdx];

  if (!current?.data) {
    return <div className="chem-no-data">No IDS data available</div>;
  }

  return (
    <div className="chem-data-preview">
      {idsFiles.length > 1 && (
        <div className="chem-data-file-tabs">
          {idsFiles.map((f, i) => (
            <button
              key={f.fileId}
              className={`chem-data-file-tab ${i === selectedIdx ? 'active' : ''}`}
              onClick={() => setSelectedIdx(i)}
            >
              {f.filePath.split('/').pop()}
            </button>
          ))}
        </div>
      )}
      <pre className="chem-json-viewer">
        {JSON.stringify(current.data, null, 2)}
      </pre>
    </div>
  );
}

export default ChemFileLineageDrawer;
