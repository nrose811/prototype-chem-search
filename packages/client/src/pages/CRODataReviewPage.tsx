import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_BATCH, BatchReview, SignatureRecord } from '../mocks/demoData';
import HistoricalComparisonChart from '../components/HistoricalComparisonChart';
import SignatureWidget from '../components/SignatureWidget';
import { createReport } from '../services/reportService';
import './CRODataReviewPage.css';

type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

function CRODataReviewPage() {
  const navigate = useNavigate();
  const [batch, setBatch] = useState<BatchReview>({ ...DEMO_BATCH });
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('Pending');
  const [assayFilter, setAssayFilter] = useState<string>('All');
  const [selectedAnalyte, setSelectedAnalyte] = useState<string | undefined>(undefined);
  const [showSignModal, setShowSignModal] = useState(false);
  const [lastSignature, setLastSignature] = useState<SignatureRecord | null>(null);

  // Get unique assay types for filter
  const assayTypes = useMemo(() => {
    const types = new Set(batch.files.map((f) => f.assayType));
    return ['All', ...Array.from(types)];
  }, [batch.files]);

  // Get unique analytes for chart filter
  const analytes = useMemo(() => {
    const set = new Set(batch.assayResults.map((r) => r.analyte));
    return Array.from(set);
  }, [batch.assayResults]);

  // Filter files by assay type
  const filteredFiles = useMemo(() => {
    if (assayFilter === 'All') return batch.files;
    return batch.files.filter((f) => f.assayType === assayFilter);
  }, [batch.files, assayFilter]);

  // Filter assay results by selected assay type
  const filteredResults = useMemo(() => {
    if (assayFilter === 'All') return batch.assayResults;
    const fileIds = new Set(filteredFiles.map((f) => f.fileId));
    return batch.assayResults.filter((r) => fileIds.has(r.fileId));
  }, [batch.assayResults, assayFilter, filteredFiles]);

  return (
    <div className="cro-data-review-page">
      <div className="cro-header">
        <h1>CRO Data Review</h1>
        <span className={`status-badge ${batch.status === 'SIGNED' ? 'signed' : 'pending'}`}>
          {batch.status === 'SIGNED' ? 'Signed' : 'Pending Signature'}
        </span>
      </div>

      <div className="review-status-bar">
        <span className="status-label">Review Status:</span>
        {(['Pending', 'Approved', 'Rejected'] as ReviewStatus[]).map((status) => (
          <button
            key={status}
            className={`status-filter-btn ${reviewStatus === status ? 'active' : ''} ${status.toLowerCase()}`}
            onClick={() => setReviewStatus(status)}
          >
            {status}
            {status === 'Pending' && ' (1)'}
          </button>
        ))}
      </div>

      <div className="batch-summary">
        <h2>{batch.batchName}</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">CRO</span>
            <span className="value">{batch.croName}</span>
          </div>
          <div className="summary-item">
            <span className="label">Study</span>
            <span className="value">{batch.studyId}</span>
          </div>
          <div className="summary-item">
            <span className="label">Project</span>
            <span className="value">{batch.projectName}</span>
          </div>
          <div className="summary-item">
            <span className="label">Dataset Version</span>
            <span className="value">{batch.datasetVersion}</span>
          </div>
          <div className="summary-item">
            <span className="label">App Version</span>
            <span className="value">{batch.appVersion}</span>
          </div>
          <div className="summary-item">
            <span className="label">Received</span>
            <span className="value">{new Date(batch.receivedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header-row">
          <h3>File Manifest ({filteredFiles.length} files)</h3>
          <div className="assay-filter">
            <label htmlFor="assay-filter">Assay Type:</label>
            <select
              id="assay-filter"
              value={assayFilter}
              onChange={(e) => setAssayFilter(e.target.value)}
            >
              {assayTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Assay Type</th>
              <th>Source System</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file) => (
              <tr key={file.fileId}>
                <td>{file.fileName}</td>
                <td>{file.assayType}</td>
                <td>{file.sourceSystem}</td>
                <td>{file.versionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>Assay Results ({filteredResults.length} results)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Sample</th>
              <th>Analyte</th>
              <th>Result</th>
              <th>Unit</th>
              <th>Specification</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result, idx) => (
              <tr key={idx}>
                <td>{result.sampleId}</td>
                <td>{result.analyte}</td>
                <td>{result.result}</td>
                <td>{result.unit}</td>
                <td>{result.specification}</td>
                <td>
                  <span className={`result-status ${result.status.toLowerCase()}`}>
                    {result.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <div className="section-header-row">
          <h3>Historical Comparison</h3>
          <div className="assay-filter">
            <label htmlFor="analyte-filter">Analyte:</label>
            <select
              id="analyte-filter"
              value={selectedAnalyte || ''}
              onChange={(e) => setSelectedAnalyte(e.target.value || undefined)}
            >
              <option value="">All Analytes</option>
              {analytes.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
        <HistoricalComparisonChart analyte={selectedAnalyte} />
      </div>

      {batch.status === 'PENDING_SIGNATURE' && (
        <div className="action-bar">
          <button
            className="sign-button"
            onClick={() => setShowSignModal(true)}
          >
            Sign and Approve Batch
          </button>
        </div>
      )}

      {batch.status === 'SIGNED' && lastSignature && (
        <div className="action-bar signed-bar">
          <div className="signed-confirmation">
            <span className="signed-icon">&#10003;</span>
            <div>
              <strong>Signed by {lastSignature.signerName}</strong>
              <span className="signed-meta">
                {new Date(lastSignature.timestamp).toLocaleString()} &mdash; {lastSignature.meaning}
              </span>
            </div>
          </div>
          <button
            className="view-report-button"
            onClick={() => navigate(`/apps/cro-data-review/report/${batch.batchId}`)}
          >
            View Signed Report
          </button>
        </div>
      )}

      {showSignModal && (
        <SignatureWidget
          batchId={batch.batchId}
          datasetVersion={batch.datasetVersion}
          onSuccess={(signature) => {
            setLastSignature(signature);
            const updatedBatch = { ...batch, status: 'SIGNED' as const };
            setBatch(updatedBatch);
            createReport(signature, updatedBatch);
            setShowSignModal(false);
          }}
          onClose={() => setShowSignModal(false)}
        />
      )}
    </div>
  );
}

export default CRODataReviewPage;

