import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { DEMO_BATCH, DEMO_USER, SignatureRecord } from '../mocks/demoData';
import SpreadsheetViewer, { SpreadsheetData } from '../components/SpreadsheetViewer';
import SignatureWidget from '../components/SignatureWidget';
import { createReport } from '../services/reportService';
import './ESignAppPage.css';

// ---- Mock "raw source" spreadsheet data keyed by fileId ----
const SOURCE_DATA: Record<string, SpreadsheetData> = {
  'file-001': {
    columns: ['Sample ID', 'Analyte', 'Raw Area', 'Std Area', 'Conc (mg/mL)', 'Assay %', 'Spec', 'Result'],
    rows: [
      { rowNumber: 1, cells: [{ value: 'S-042-01' }, { value: 'Active Compound A' }, { value: 524819 }, { value: 529330 }, { value: 9.92 }, { value: 99.2 }, { value: '95.0–105.0%' }, { value: 'Pass' }] },
      { rowNumber: 2, cells: [{ value: 'S-042-02' }, { value: 'Active Compound A' }, { value: 521450 }, { value: 529330 }, { value: 9.87 }, { value: 98.7 }, { value: '95.0–105.0%' }, { value: 'Pass' }] },
      { rowNumber: 3, cells: [{ value: 'S-042-03' }, { value: 'Active Compound A' }, { value: 530122 }, { value: 529330 }, { value: 10.01 }, { value: 100.1 }, { value: '95.0–105.0%' }, { value: 'Pass' }] },
    ],
  },
  'file-002': {
    columns: ['Sample ID', 'Analyte', 'Peak Area', 'RRT', 'Result %', 'Limit', 'Result'],
    rows: [
      { rowNumber: 1, cells: [{ value: 'S-042-01' }, { value: 'Impurity B' }, { value: 6210 }, { value: 0.85 }, { value: 0.12 }, { value: '≤ 0.5%' }, { value: 'Pass' }] },
      { rowNumber: 2, cells: [{ value: 'S-042-02' }, { value: 'Impurity B' }, { value: 4680 }, { value: 0.85 }, { value: 0.09 }, { value: '≤ 0.5%' }, { value: 'Pass' }] },
      { rowNumber: 3, cells: [{ value: 'S-042-03' }, { value: 'Total Impurities' }, { value: 18120 }, { value: '-' }, { value: 0.35 }, { value: '≤ 2.0%' }, { value: 'Pass' }] },
    ],
  },
  'file-003': {
    columns: ['Sample ID', 'Analyte', 'Observed m/z', 'Expected m/z', 'Delta (Da)', 'Tolerance', 'Result'],
    rows: [
      { rowNumber: 1, cells: [{ value: 'S-042-01' }, { value: 'MW Confirmation' }, { value: 384.21 }, { value: 384.20 }, { value: 0.01 }, { value: '± 0.5 Da' }, { value: 'Pass' }] },
    ],
  },
  'file-004': {
    columns: ['Sample ID', 'Analyte', 'Time Point', 'Assay %', 'Spec', 'Result'],
    rows: [
      { rowNumber: 1, cells: [{ value: 'S-042-01' }, { value: 'Active Compound A' }, { value: 'T=0' }, { value: 99.5 }, { value: '≥ 95.0%' }, { value: 'Pass' }] },
      { rowNumber: 2, cells: [{ value: 'S-042-01' }, { value: 'Active Compound A' }, { value: 'T=3mo' }, { value: 98.8 }, { value: '≥ 95.0%' }, { value: 'Pass' }] },
    ],
  },
};

interface TimelineEvent { id: string; eventType: string; actor: string; timestamp: string; detail: string; }

const TIMELINE_EVENTS: Record<string, TimelineEvent[]> = {
  'file-001': [
    { id: 'tl-1', eventType: 'File Created', actor: 'System Agent', timestamp: '2026-03-15T14:28:00Z', detail: 'Ingested from CRO Alpha pipeline' },
    { id: 'tl-2', eventType: 'Label Added', actor: 'j.doe@lab.com', timestamp: '2026-03-15T15:02:00Z', detail: 'esign:status set to Pending' },
    { id: 'tl-3', eventType: 'File Updated', actor: 's.smith@lab.com', timestamp: '2026-03-16T09:45:00Z', detail: 'New Version (v2) Detected' },
    { id: 'tl-4', eventType: 'Label Changed', actor: 'Integrity-Bot', timestamp: '2026-03-16T09:45:05Z', detail: 'esign:status reset to Pending' },
    { id: 'tl-5a', eventType: 'E-Signature Applied', actor: 'Dr. Sarah Chen', timestamp: '2026-03-17T10:15:00Z', detail: 'Signed with meaning: "Review and Approval" — Auth: Username + Password' },
  ],
  'file-002': [
    { id: 'tl-5', eventType: 'File Created', actor: 'System Agent', timestamp: '2026-03-15T14:28:30Z', detail: 'Ingested from CRO Alpha pipeline' },
    { id: 'tl-6', eventType: 'Label Added', actor: 'j.doe@lab.com', timestamp: '2026-03-15T15:03:00Z', detail: 'esign:status set to Pending' },
  ],
  'file-003': [
    { id: 'tl-7', eventType: 'File Created', actor: 'System Agent', timestamp: '2026-03-15T14:29:00Z', detail: 'Ingested from CRO Alpha pipeline' },
    { id: 'tl-8', eventType: 'Label Added', actor: 'j.doe@lab.com', timestamp: '2026-03-15T15:04:00Z', detail: 'esign:status set to Pending' },
  ],
  'file-004': [
    { id: 'tl-9', eventType: 'File Created', actor: 'System Agent', timestamp: '2026-03-15T14:29:30Z', detail: 'Ingested from CRO Alpha pipeline' },
    { id: 'tl-10', eventType: 'Label Added', actor: 'j.doe@lab.com', timestamp: '2026-03-15T15:05:00Z', detail: 'esign:status set to Pending' },
  ],
};

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

type SignStatus = 'pending' | 'signed';

interface ESignManifest {
  version: string;   // e.g. "v3"
  status: 'pending' | 'signed';
  timestamp: string; // ISO 8601
}

// file-001 is pre-signed for demo purposes
const PRE_SIGNED_FILE_ID = 'file-001';
const PRE_SIGNED_SIGNATURE: SignatureRecord = {
  signatureId: 'sig-demo-batch042-1710700800000',
  signerId: DEMO_USER.userId,
  signerName: DEMO_USER.name,
  timestamp: '2026-03-15T14:30:00.000Z',
  timezone: 'America/New_York',
  meaning: 'Review and Approval',
  authenticationMethod: 'Username + Password',
  datasetVersion: 'v3',
  reportId: 'rpt-batch-042-1710700800000',
  status: 'APPLIED',
  batchId: 'batch-042',
};

function ESignAppPage() {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();

  // Look up the file from the demo batch
  const file = DEMO_BATCH.files.find((f) => f.fileId === fileId);
  const assayResults = DEMO_BATCH.assayResults.filter((r) => r.fileId === fileId);
  const sourceData = fileId ? SOURCE_DATA[fileId] : undefined;

  const isPreSigned = fileId === PRE_SIGNED_FILE_ID;
  const [fileIdInput, setFileIdInput] = useState('');
  const [status, setStatus] = useState<SignStatus>(isPreSigned ? 'signed' : 'pending');
  const [showSignModal, setShowSignModal] = useState(false);
  const [lastSignature, setLastSignature] = useState<SignatureRecord | null>(isPreSigned ? PRE_SIGNED_SIGNATURE : null);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [dynamicEvents, setDynamicEvents] = useState<TimelineEvent[]>([]);
  const [esignManifest, setEsignManifest] = useState<ESignManifest | null>(
    isPreSigned && file ? { version: file.versionId, status: 'signed', timestamp: PRE_SIGNED_SIGNATURE.timestamp } : null
  );
  const allTimelineEvents = [...(fileId ? TIMELINE_EVENTS[fileId] || [] : []), ...dynamicEvents];

  const handleSignatureSuccess = (signature: SignatureRecord) => {
    setStatus('signed');
    setLastSignature(signature);
    setShowSignModal(false);
    createReport(signature);
    // Pin the current file version in the esign_manifest label
    if (file) {
      setEsignManifest({ version: file.versionId, status: 'signed', timestamp: signature.timestamp });
    }
    setDynamicEvents((prev) => [...prev, {
      id: `tl-sig-${Date.now()}`,
      eventType: 'E-Signature Applied',
      actor: signature.signerName,
      timestamp: signature.timestamp,
      detail: `Signed with meaning: "${signature.meaning}" — Auth: ${signature.authenticationMethod}`,
    }]);
  };

  if (!fileId) {
    return (
      <div className="esign-app-page">
        <div className="esign-landing">
          <h2>eSignature Review</h2>
          <p>Enter a File ID to open for review and e-signature.</p>
          <form className="esign-landing-form" onSubmit={(e) => { e.preventDefault(); if (fileIdInput.trim()) navigate(`/apps/esign/${fileIdInput.trim()}`); }}>
            <input type="text" className="esign-landing-input" placeholder="e.g. file-001" value={fileIdInput} onChange={(e) => setFileIdInput(e.target.value)} />
            <button type="submit" className="esign-landing-btn" disabled={!fileIdInput.trim()}>Open File</button>
          </form>
          <div className="esign-landing-hint">
            <p>Available demo files:</p>
            <ul>
              {DEMO_BATCH.files.map(f => (
                <li key={f.fileId}><button className="esign-landing-link" onClick={() => navigate(`/apps/esign/${f.fileId}`)}>{f.fileId}</button> — {f.fileName}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="esign-app-page">
        <div className="esign-not-found">
          <h2>File not found</h2>
          <p>No file with ID <code>{fileId}</code> was found in the current batch.</p>
          <button className="esign-back-btn" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="esign-app-page">
      {/* ---- Header ---- */}
      <div className="esign-header">
        <div className="esign-header-left">
          <button className="esign-back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <div className="esign-header-info">
            <h1 className="esign-file-name">{file.fileName}</h1>
          </div>
        </div>

        <div className="esign-header-right">
          <Link to="/audit-trail" className="esign-audit-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Audit Trail
          </Link>

          {status === 'pending' && (
            <button className="esign-sign-btn" onClick={() => setShowSignModal(true)}>
              Sign and Approve
            </button>
          )}
        </div>
      </div>

      {/* ---- Signed confirmation bar ---- */}
      {status === 'signed' && lastSignature && (
        <div className="esign-signed-bar">
          <span className="esign-signed-icon">&#10003;</span>
          <div className="esign-signed-info">
            <strong>Signed by {lastSignature.signerName}</strong>
            <span>{new Date(lastSignature.timestamp).toLocaleString()} — {lastSignature.meaning}</span>
          </div>
          <button className="esign-view-report-btn" onClick={() => navigate(`/apps/cro-data-review/report/${DEMO_BATCH.batchId}`)}>
            View Signed Report
          </button>
        </div>
      )}

      {/* ---- File Information Pane ---- */}
      <div className="esign-file-info-pane">
        <div className="esign-info-section">
          <h3>Attributes</h3>
          <div className="esign-info-grid">
            <div className="esign-info-item">
              <div className="esign-info-value">{file.assayType}</div>
              <div className="esign-info-label">Assay Type</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">{file.sourceSystem}</div>
              <div className="esign-info-label">Source System</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">Batch 42</div>
              <div className="esign-info-label">Batch</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">CRO Alpha</div>
              <div className="esign-info-label">Study Name</div>
            </div>
            {status === 'signed' && lastSignature && (
              <>
                <div className="esign-info-item">
                  <div className="esign-info-value"><span className="esign-info-signed-badge">Signed</span></div>
                  <div className="esign-info-label">eSignature Status</div>
                </div>
                <div className="esign-info-item">
                  <div className="esign-info-value">{new Date(lastSignature.timestamp).toLocaleString()}</div>
                  <div className="esign-info-label">eSignature Date</div>
                </div>
                <div className="esign-info-item">
                  <div className="esign-info-value">{lastSignature.signerName}</div>
                  <div className="esign-info-label">Signer</div>
                </div>
              </>
            )}
            {esignManifest && (
              <div className="esign-info-item esign-info-item-full">
                <div className="esign-info-value">
                  <code className="esign-manifest-json">{JSON.stringify(esignManifest, null, 2)}</code>
                </div>
                <div className="esign-info-label">esign_manifest</div>
              </div>
            )}
          </div>
        </div>
        <div className="esign-info-section">
          <h3>Information</h3>
          <div className="esign-info-grid">
            <div className="esign-info-item">
              <div className="esign-info-value">{file.fileName}</div>
              <div className="esign-info-label">File Name</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">{file.fileId}</div>
              <div className="esign-info-label">File ID</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">/tetrasphere/cro-data/{file.sourceSystem.toLowerCase().replace(/\s+/g, '-')}</div>
              <div className="esign-info-label">File Path</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">{new Date(file.uploadedAt).toLocaleString()}</div>
              <div className="esign-info-label">Upload Date</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">JSON</div>
              <div className="esign-info-label">Source Type</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">{file.versionId}</div>
              <div className="esign-info-label">Version</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- File Preview ---- */}
      <div className="esign-workspace esign-workspace-single">
        <div className="esign-pane esign-pane-source">
          <div className="esign-pane-header">
            <span className="esign-pane-label">File Preview</span>
          </div>
          <div className="esign-pane-body">
            {sourceData ? (
              <SpreadsheetViewer data={sourceData} fileName={file.fileName} />
            ) : (
              <div className="esign-no-preview"><p>Preview not available for this file type.</p></div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Audit Trail ---- */}
      <div className="esign-timeline-section">
        <button className="esign-timeline-toggle" onClick={() => setTimelineOpen(!timelineOpen)}>
          <span className="esign-timeline-chevron">{timelineOpen ? '▾' : '▸'}</span>
          Audit Trail ({allTimelineEvents.length})
        </button>
        {timelineOpen && (
          <table className="esign-timeline-table">
            <thead>
              <tr><th>Event Type</th><th>Actor</th><th>Timestamp</th><th>Change Detail</th></tr>
            </thead>
            <tbody>
              {allTimelineEvents.map(ev => (
                <tr key={ev.id} className={ev.eventType === 'E-Signature Applied' ? 'esign-timeline-sig' : ''}>
                  <td><span className={`esign-tl-type ${ev.eventType.replace(/\s+/g, '-').toLowerCase()}`}>{ev.eventType}</span></td>
                  <td>{ev.actor}</td>
                  <td>{fmtTime(ev.timestamp)}</td>
                  <td>{ev.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---- Signature modal ---- */}
      {showSignModal && (
        <SignatureWidget
          batchId={DEMO_BATCH.batchId}
          datasetVersion={DEMO_BATCH.datasetVersion}
          onSuccess={handleSignatureSuccess}
          onClose={() => setShowSignModal(false)}
          auditContext={{ origin: 'eSign App', datasetVersion: DEMO_BATCH.datasetVersion }}
        />
      )}
    </div>
  );
}

export default ESignAppPage;

