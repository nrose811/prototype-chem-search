import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { DEMO_BATCH, DEMO_USER, SignatureRecord, findDemoFile } from '../mocks/demoData';
import SpreadsheetViewer from '../components/SpreadsheetViewer';
import SignatureWidget from '../components/SignatureWidget';
import { createReport } from '../services/reportService';
import { generateSourceData, generateTimelineEvents, TimelineEvent } from '../utils/assayDataGenerators';
import './ESignAppPage.css';



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

  // Look up the file from the demo batch, falling back to broader demo data
  const batchFile = DEMO_BATCH.files.find((f) => f.fileId === fileId);
  const file = batchFile || (fileId ? findDemoFile(fileId) : undefined);
  const assayResults = DEMO_BATCH.assayResults.filter((r) => r.fileId === fileId);
  const sourceData = file ? generateSourceData(file) : undefined;

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
  const baseTimelineEvents = file ? generateTimelineEvents(file) : [];
  const allTimelineEvents = [...baseTimelineEvents, ...dynamicEvents];

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
              <div className="esign-info-value">{batchFile ? 'Batch 42' : file.fileName.match(/(\w+-\d+)/)?.[1] || file.fileId}</div>
              <div className="esign-info-label">Batch</div>
            </div>
            <div className="esign-info-item">
              <div className="esign-info-value">{batchFile ? 'CRO Alpha' : file.sourceSystem}</div>
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

