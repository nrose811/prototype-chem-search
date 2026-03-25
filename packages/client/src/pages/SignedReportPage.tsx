import { useNavigate } from 'react-router-dom';
import { DEMO_USER } from '../mocks/demoData';
import { getReport } from '../services/reportService';
import './SignedReportPage.css';

function SignedReportPage() {
  const navigate = useNavigate();
  const report = getReport();
  const { signature, batchSnapshot: batch, reportId, generatedAt } = report;
  const signedDate = new Date(signature.timestamp);
  const generatedDate = new Date(generatedAt);

  return (
    <div className="signed-report-canvas">
      {/* ---- PDF Toolbar ---- */}
      <div className="pdf-toolbar">
        <div className="pdf-toolbar-left">
          <span className="pdf-icon">PDF</span>
          <span>CRO-Data-Review-Signed-Report-{reportId}.pdf</span>
        </div>
        <div className="pdf-toolbar-right">
          <button onClick={() => navigate('/apps/cro-data-review')}>Back to Review</button>
          <button onClick={() => navigate('/audit-trail')}>Audit Trail</button>
          <button onClick={() => window.print()}>🖨 Print</button>
        </div>
      </div>

      <div className="signed-report-page">
      {/* ---- Report Header ---- */}
      <div className="report-header">
        <div className="report-title-row">
          <h1>CRO Data Review &mdash; Signed Report</h1>
        </div>
        <div className="report-meta-row">
          <span>Report ID: <strong>{reportId}</strong></span>
          <span>Generated: <strong>{generatedDate.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* ---- Batch Summary ---- */}
      <div className="report-section">
        <h2>Batch Summary</h2>
        <div className="report-grid">
          <div className="report-field">
            <span className="report-label">Batch</span>
            <span className="report-value">{batch.batchName}</span>
          </div>
          <div className="report-field">
            <span className="report-label">CRO</span>
            <span className="report-value">{batch.croName}</span>
          </div>
          <div className="report-field">
            <span className="report-label">Study</span>
            <span className="report-value">{batch.studyId}</span>
          </div>
          <div className="report-field">
            <span className="report-label">Project</span>
            <span className="report-value">{batch.projectName}</span>
          </div>
          <div className="report-field">
            <span className="report-label">App Version</span>
            <span className="report-value">{batch.appVersion}</span>
          </div>
          <div className="report-field">
            <span className="report-label">Dataset Version</span>
            <span className="report-value">{batch.datasetVersion}</span>
          </div>
        </div>
      </div>

      {/* ---- Key Results Summary ---- */}
      <div className="report-section">
        <h2>Assay Results Summary</h2>
        <table className="report-table">
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
            {batch.assayResults.map((r, idx) => (
              <tr key={idx}>
                <td>{r.sampleId}</td>
                <td>{r.analyte}</td>
                <td>{r.result}</td>
                <td>{r.unit}</td>
                <td>{r.specification}</td>
                <td>
                  <span className={`report-result-status ${r.status.toLowerCase()}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="report-result-summary">
          {batch.assayResults.length} results &mdash;{' '}
          {batch.assayResults.filter((r) => r.status === 'Pass').length} passed,{' '}
          {batch.assayResults.filter((r) => r.status === 'Fail').length} failed
        </p>
      </div>

      {/* ---- File Manifest ---- */}
      <div className="report-section">
        <h2>File Manifest</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Assay Type</th>
              <th>Source System</th>
              <th>Version</th>
              <th>SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody>
            {batch.files.map((file) => (
              <tr key={file.fileId}>
                <td>{file.fileName}</td>
                <td>{file.assayType}</td>
                <td>{file.sourceSystem}</td>
                <td>{file.versionId}</td>
                <td className="hash">{file.sha256}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Signature Block ---- */}
      <div className="report-section report-signature-block">
        <h2>Electronic Signature</h2>
        <div className="report-grid">
          <div className="report-field">
            <span className="report-label">Signer</span>
            <span className="report-value">{signature.signerName}</span>
          </div>
          <div className="report-field">
            <span className="report-label">User ID</span>
            <span className="report-value">{signature.signerId}</span>
          </div>
          <div className="report-field">
            <span className="report-label">Role</span>
            <span className="report-value">{DEMO_USER.role}</span>
          </div>
          <div className="report-field">
            <span className="report-label">Organization</span>
            <span className="report-value">{DEMO_USER.organization}</span>
          </div>
          <div className="report-field">
            <span className="report-label">Meaning of Signature</span>
            <span className="report-value report-meaning">{signature.meaning}</span>
          </div>
          <div className="report-field">
            <span className="report-label">Authentication Method</span>
            <span className="report-value">{signature.authenticationMethod}</span>
          </div>
          <div className="report-field">
            <span className="report-label">Date &amp; Time</span>
            <span className="report-value">
              {signedDate.toLocaleDateString()} {signedDate.toLocaleTimeString()}
            </span>
          </div>
          <div className="report-field">
            <span className="report-label">Timezone</span>
            <span className="report-value">{signature.timezone}</span>
          </div>
          <div className="report-field full-width">
            <span className="report-label">Signature ID</span>
            <span className="report-value hash">{signature.signatureId}</span>
          </div>
        </div>
      </div>

      {/* ---- Footer ---- */}
      <div className="report-footer">
        <p>This report was electronically generated and signed via the TetraScience Data Platform.</p>
        <p>Report ID: {reportId} &bull; Dataset Version: {batch.datasetVersion}</p>
      </div>

      </div>
    </div>
  );
}

export default SignedReportPage;

