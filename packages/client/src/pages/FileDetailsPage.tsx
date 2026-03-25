import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './FileDetailsPage.css';
import './SignedReportPage.css';
import SpreadsheetViewer, { SpreadsheetData } from '../components/SpreadsheetViewer';
import FileAssistant from '../components/FileAssistant';
import { DEMO_BATCH, DEMO_USER, SignatureRecord, findDemoFile } from '../mocks/demoData';
import { getReport } from '../services/reportService';
import { useAuthProvider } from '../contexts/AuthProviderContext';



interface FileData {
  id: string;
  name: string;
  sourceLocation: string;
  uploadedAt: string;
  uploadedAtRelative: string;
  fileType: 'document' | 'zip' | 'csv' | 'xlsx' | 'xls';
  content?: string;
}

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const OpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const LineageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3"></circle>
    <circle cx="6" cy="6" r="3"></circle>
    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
    <line x1="6" y1="9" x2="6" y2="21"></line>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.33333 10H2.66667C2.31304 10 1.97391 9.85952 1.72386 9.60947C1.47381 9.35942 1.33333 9.02029 1.33333 8.66667V2.66667C1.33333 2.31304 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31304 1.33333 2.66667 1.33333H8.66667C9.02029 1.33333 9.35942 1.47381 9.60947 1.72386C9.85952 1.97391 10 2.31304 10 2.66667V3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// AI Assistant icon
const AIAssistantIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

interface AssayRow { sample: string; analyte: string; result: string; unit: string; spec: string; status: 'Pass' | 'Fail'; }

function getMockAssayResults(assayType: string): AssayRow[] {
  switch (assayType) {
    case 'Potency':
      return [
        { sample: 'S-01', analyte: 'Active Compound A', result: '99.2', unit: '%', spec: '95.0–105.0%', status: 'Pass' },
        { sample: 'S-02', analyte: 'Active Compound A', result: '98.7', unit: '%', spec: '95.0–105.0%', status: 'Pass' },
        { sample: 'S-03', analyte: 'Active Compound A', result: '100.1', unit: '%', spec: '95.0–105.0%', status: 'Pass' },
      ];
    case 'Purity':
      return [
        { sample: 'S-01', analyte: 'Main Peak', result: '99.6', unit: '%', spec: '>= 98.0%', status: 'Pass' },
        { sample: 'S-01', analyte: 'Impurity B', result: '0.12', unit: '%', spec: '<= 0.5%', status: 'Pass' },
        { sample: 'S-01', analyte: 'Total Impurities', result: '0.35', unit: '%', spec: '<= 2.0%', status: 'Pass' },
      ];
    case 'Identity':
      return [
        { sample: 'S-01', analyte: 'MW Confirmation', result: '384.2', unit: 'Da', spec: '384.2 ± 0.5 Da', status: 'Pass' },
        { sample: 'S-01', analyte: 'UV Max', result: '268', unit: 'nm', spec: '268 ± 2 nm', status: 'Pass' },
      ];
    case 'Stability':
      return [
        { sample: 'S-01', analyte: 'Active Compound A (T=0)', result: '99.5', unit: '%', spec: '>= 95.0%', status: 'Pass' },
        { sample: 'S-01', analyte: 'Active Compound A (T=3mo)', result: '98.8', unit: '%', spec: '>= 95.0%', status: 'Pass' },
        { sample: 'S-01', analyte: 'Active Compound A (T=6mo)', result: '97.4', unit: '%', spec: '>= 95.0%', status: 'Pass' },
      ];
    case 'Dissolution':
      return [
        { sample: 'S-01', analyte: 'Dissolved at 15 min', result: '72', unit: '%', spec: '>= 70%', status: 'Pass' },
        { sample: 'S-01', analyte: 'Dissolved at 30 min', result: '89', unit: '%', spec: '>= 85%', status: 'Pass' },
        { sample: 'S-01', analyte: 'Dissolved at 45 min', result: '96', unit: '%', spec: '>= 90%', status: 'Pass' },
      ];
    case 'Content Uniformity':
      return [
        { sample: 'T-01', analyte: 'Content', result: '100.2', unit: '%', spec: '85.0–115.0%', status: 'Pass' },
        { sample: 'T-02', analyte: 'Content', result: '98.7', unit: '%', spec: '85.0–115.0%', status: 'Pass' },
        { sample: 'T-03', analyte: 'Content', result: '101.5', unit: '%', spec: '85.0–115.0%', status: 'Pass' },
        { sample: 'RSD', analyte: 'RSD', result: '1.4', unit: '%', spec: '<= 6.0%', status: 'Pass' },
      ];
    case 'Residual Solvents':
      return [
        { sample: 'S-01', analyte: 'Methanol', result: '24', unit: 'ppm', spec: '<= 3000 ppm', status: 'Pass' },
        { sample: 'S-01', analyte: 'Ethanol', result: '45', unit: 'ppm', spec: '<= 5000 ppm', status: 'Pass' },
        { sample: 'S-01', analyte: 'Acetonitrile', result: '18', unit: 'ppm', spec: '<= 410 ppm', status: 'Pass' },
      ];
    case 'Water Content':
      return [
        { sample: 'S-01', analyte: 'Water (KF Titration)', result: '0.42', unit: '%', spec: '<= 1.0%', status: 'Pass' },
        { sample: 'S-02', analyte: 'Water (KF Titration)', result: '0.38', unit: '%', spec: '<= 1.0%', status: 'Pass' },
      ];
    case 'Particle Size':
      return [
        { sample: 'S-01', analyte: 'D10', result: '12.3', unit: 'µm', spec: '5–25 µm', status: 'Pass' },
        { sample: 'S-01', analyte: 'D50', result: '48.7', unit: 'µm', spec: '30–70 µm', status: 'Pass' },
        { sample: 'S-01', analyte: 'D90', result: '124.5', unit: 'µm', spec: '80–200 µm', status: 'Pass' },
      ];
    case 'Sterility':
      return [
        { sample: 'S-01', analyte: 'Bacterial Endotoxins', result: '< 0.05', unit: 'EU/mL', spec: '<= 0.5 EU/mL', status: 'Pass' },
        { sample: 'S-01', analyte: 'Bioburden', result: '< 1', unit: 'CFU/mL', spec: '< 10 CFU/mL', status: 'Pass' },
      ];
    default:
      return [
        { sample: 'S-01', analyte: assayType, result: '98.5', unit: '%', spec: '>= 95.0%', status: 'Pass' },
      ];
  }
}

function FileDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [showHistory, setShowHistory] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isOpenDropdownOpen, setIsOpenDropdownOpen] = useState(false);
  const openDropdownRef = useRef<HTMLDivElement>(null);
  const { authProvider } = useAuthProvider();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownRef.current && !openDropdownRef.current.contains(event.target as Node)) {
        setIsOpenDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Check if this file is part of the signed batch
  const report = getReport();
  const batchFile = DEMO_BATCH.files.find((f) => f.fileId === id);
  // Also look up from the broader demo file set (unsigned, signed, reports)
  const demoFile = batchFile || findDemoFile(id || '');
  // Show signed state for batch files (pre-signed or live-signed) OR any file with an esignManifest
  const isSigned = !!(batchFile) || !!(demoFile?.esignManifest);
  // Build signature: use esignManifest data for standalone signed files, report signature for batch files
  const signature: SignatureRecord = (demoFile?.esignManifest && !batchFile) ? {
    signatureId: `sig-${demoFile.fileId}`,
    signerId: DEMO_USER.userId,
    signerName: DEMO_USER.name,
    timestamp: demoFile.esignManifest.timestamp,
    timezone: 'EST',
    meaning: 'Review and Approval',
    authenticationMethod: authProvider.type === 'sso' ? `SSO – ${authProvider.label} (OIDC)` : 'Username + Password',
    datasetVersion: demoFile.versionId,
    reportId: `rpt-${demoFile.fileId}`,
    status: 'APPLIED',
    batchId: '',
  } : {
    ...report.signature,
    authenticationMethod: report.signature.authenticationMethod === 'Username + Password' && authProvider.type === 'sso'
      ? `SSO – ${authProvider.label} (OIDC)`
      : report.signature.authenticationMethod,
  };

  // Get data from navigation state, demo file lookup, or use default
  const fileData: FileData = (location.state as { data?: FileData })?.data || (demoFile ? {
    id: demoFile.fileId,
    name: demoFile.fileName,
    sourceLocation: `/tetrasphere/cro-data/${demoFile.sourceSystem}`,
    uploadedAt: new Date(demoFile.uploadedAt).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'medium' }) + ' EST',
    uploadedAtRelative: 'Today',
    fileType: 'document' as const,
  } : {
    id: id || '1',
    name: 'Proteomics-Study3-Protocol.txt',
    sourceLocation: '/tetrasphere/proteomics/study-3/docs',
    uploadedAt: '01/09/2026 04:30:00 PM EST',
    uploadedAtRelative: 'Yesterday',
    fileType: 'document' as const,
  });

  // Mock spreadsheet data - similar to Google Sheets/Gemini example
  const spreadsheetData: SpreadsheetData = {
    columns: ['A', 'B', 'C', 'D', 'E'],
    rows: [
      { rowNumber: 1, cells: [{ value: 'Organization' }, { value: 'Total Pipeline Executions' }, { value: 'Successful' }, { value: 'Failed' }, { value: 'Success Rate' }] },
      { rowNumber: 2, cells: [{ value: 'Acme Labs' }, { value: 1250 }, { value: 1180 }, { value: 70 }, { value: '94.4%' }] },
      { rowNumber: 3, cells: [{ value: 'BioTech Solutions' }, { value: 890 }, { value: 845 }, { value: 45 }, { value: '94.9%' }] },
      { rowNumber: 4, cells: [{ value: 'Genome Research Inc' }, { value: 2100 }, { value: 1995 }, { value: 105 }, { value: '95.0%' }] },
      { rowNumber: 5, cells: [{ value: 'Pharma Analytics' }, { value: 756 }, { value: 718 }, { value: 38 }, { value: '95.0%' }] },
      { rowNumber: 6, cells: [{ value: 'Research Partners' }, { value: 1580 }, { value: 1501 }, { value: 79 }, { value: '95.0%' }] },
      { rowNumber: 7, cells: [{ value: 'Data Science Co' }, { value: 920 }, { value: 883 }, { value: 37 }, { value: '96.0%' }] },
      { rowNumber: 8, cells: [{ value: 'Clinical Insights' }, { value: 1100 }, { value: 1056 }, { value: 44 }, { value: '96.0%' }] },
      { rowNumber: 9, cells: [{ value: 'Molecular Dynamics' }, { value: 680 }, { value: 653 }, { value: 27 }, { value: '96.0%' }] },
      { rowNumber: 10, cells: [{ value: 'Life Sciences Ltd' }, { value: 1450 }, { value: 1392 }, { value: 58 }, { value: '96.0%' }] },
      { rowNumber: 11, cells: [{ value: 'Discovery Labs' }, { value: 2340 }, { value: 2270 }, { value: 70 }, { value: '97.0%' }] },
      { rowNumber: 12, cells: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }] },
      { rowNumber: 13, cells: [{ value: 'Total' }, { value: 13066 }, { value: 12493 }, { value: 573 }, { value: '95.6%' }] },
    ],
  };

  const isSpreadsheet = fileData.fileType === 'xlsx' || fileData.fileType === 'xls';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="file-details-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <BackIcon />
          <span>Back</span>
        </button>
      </div>
      <div className="file-details-content">
        <div className="file-details-main">
          <div className="file-details-left">
            <div className="attributes-section">
              <h3>Attributes</h3>
              {isSpreadsheet ? (
                <>
                  <div className="attribute-item">
                    <div className="attribute-value">Pipeline Analytics</div>
                    <div className="attribute-label">Report Type</div>
                    <button className="copy-btn" onClick={() => handleCopy('Pipeline Analytics', 'attr-report-type')}>
                      {copiedId === 'attr-report-type' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">Q1 2026</div>
                    <div className="attribute-label">Time Period</div>
                    <button className="copy-btn" onClick={() => handleCopy('Q1 2026', 'attr-time-period')}>
                      {copiedId === 'attr-time-period' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">Operations Team</div>
                    <div className="attribute-label">Owner</div>
                    <button className="copy-btn" onClick={() => handleCopy('Operations Team', 'attr-owner')}>
                      {copiedId === 'attr-owner' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </>
              ) : fileData.sourceLocation.includes('chromatography') ? (
                <>
                  <div className="attribute-item">
                    <div className="attribute-value">Chromatography Analysis</div>
                    <div className="attribute-label">Analysis Type</div>
                    <button className="copy-btn" onClick={() => handleCopy('Chromatography Analysis', 'attr-analysis-type')}>
                      {copiedId === 'attr-analysis-type' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">{fileData.sourceLocation.includes('hplc') ? 'HPLC' : fileData.sourceLocation.includes('lc-ms') ? 'LC-MS' : fileData.sourceLocation.includes('gc') ? 'GC' : 'Unknown'}</div>
                    <div className="attribute-label">Instrument Type</div>
                    <button className="copy-btn" onClick={() => handleCopy(fileData.sourceLocation.includes('hplc') ? 'HPLC' : fileData.sourceLocation.includes('lc-ms') ? 'LC-MS' : fileData.sourceLocation.includes('gc') ? 'GC' : 'Unknown', 'attr-instrument')}>
                      {copiedId === 'attr-instrument' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">Raw Data</div>
                    <div className="attribute-label">Data Type</div>
                    <button className="copy-btn" onClick={() => handleCopy('Raw Data', 'attr-data-type')}>
                      {copiedId === 'attr-data-type' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="attribute-item">
                    <div className="attribute-value">Proteomics Study 3</div>
                    <div className="attribute-label">Study Name</div>
                    <button className="copy-btn" onClick={() => handleCopy('Proteomics Study 3', 'attr-study-name')}>
                      {copiedId === 'attr-study-name' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">Protocol</div>
                    <div className="attribute-label">Document Type</div>
                    <button className="copy-btn" onClick={() => handleCopy('Protocol', 'attr-doc-type')}>
                      {copiedId === 'attr-doc-type' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">Dr. Sarah Chen</div>
                    <div className="attribute-label">Principal Investigator</div>
                    <button className="copy-btn" onClick={() => handleCopy('Dr. Sarah Chen', 'attr-pi')}>
                      {copiedId === 'attr-pi' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </>
              )}
              {isSigned && (
                <>
                  <div className="attribute-item">
                    <div className="attribute-value">Signed</div>
                    <div className="attribute-label">eSignature Status</div>
                    <button className="copy-btn" onClick={() => handleCopy('Signed', 'attr-esig-status')}>
                      {copiedId === 'attr-esig-status' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">{new Date(signature.timestamp).toLocaleString()}</div>
                    <div className="attribute-label">eSignature Date</div>
                    <button className="copy-btn" onClick={() => handleCopy(new Date(signature.timestamp).toLocaleString(), 'attr-esig-date')}>
                      {copiedId === 'attr-esig-date' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">{signature.signerName}</div>
                    <div className="attribute-label">eSignature Signer</div>
                    <button className="copy-btn" onClick={() => handleCopy(signature.signerName, 'attr-esig-signer')}>
                      {copiedId === 'attr-esig-signer' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="attribute-item">
                    <div className="attribute-value">{signature.meaning}</div>
                    <div className="attribute-label">eSignature Meaning</div>
                    <button className="copy-btn" onClick={() => handleCopy(signature.meaning, 'attr-esig-meaning')}>
                      {copiedId === 'attr-esig-meaning' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  {demoFile && (
                    <div className="attribute-item attribute-item-full">
                      <div className="attribute-value">
                        <code className="esign-manifest-json">{JSON.stringify({ version: demoFile.versionId, status: 'signed', timestamp: signature.timestamp }, null, 2)}</code>
                      </div>
                      <div className="attribute-label">esign_manifest</div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="information-section">
              <h3>Information</h3>
              <div className="info-item">
                <div className="info-value">{fileData.name}</div>
                <div className="info-label">File Name</div>
                <button className="copy-btn" onClick={() => handleCopy(fileData.name, 'info-file-name')}>
                  {copiedId === 'info-file-name' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-item">
                <div className="info-value">{fileData.id}</div>
                <div className="info-label">File ID</div>
                <button className="copy-btn" onClick={() => handleCopy(fileData.id, 'info-file-id')}>
                  {copiedId === 'info-file-id' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-item">
                <div className="info-value">{fileData.sourceLocation}</div>
                <div className="info-label">File Path</div>
                <button className="copy-btn" onClick={() => handleCopy(fileData.sourceLocation, 'info-file-path')}>
                  {copiedId === 'info-file-path' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-item">
                <div className="info-value">{fileData.sourceLocation}</div>
                <div className="info-label">Source Location</div>
                <button className="copy-btn" onClick={() => handleCopy(fileData.sourceLocation, 'info-source-location')}>
                  {copiedId === 'info-source-location' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-item">
                <div className="info-value">{fileData.uploadedAt}</div>
                <div className="info-label">Upload date</div>
                <button className="copy-btn" onClick={() => handleCopy(fileData.uploadedAt, 'info-upload-date')}>
                  {copiedId === 'info-upload-date' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-item">
                <div className="info-value">{fileData.fileType === 'xlsx' || fileData.fileType === 'xls' ? 'Excel Spreadsheet' : fileData.fileType === 'csv' ? 'CSV File' : fileData.fileType === 'zip' ? 'ZIP Archive' : 'Document'}</div>
                <div className="info-label">Source Type</div>
                <button className="copy-btn" onClick={() => handleCopy(fileData.fileType === 'xlsx' || fileData.fileType === 'xls' ? 'Excel Spreadsheet' : fileData.fileType === 'csv' ? 'CSV File' : fileData.fileType === 'zip' ? 'ZIP Archive' : 'Document', 'info-source-type')}>
                  {copiedId === 'info-source-type' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
              <div className="info-item">
                <div className="info-value">18.5 KB</div>
                <div className="info-label">Size</div>
                <button className="copy-btn" onClick={() => handleCopy('18.5 KB', 'info-size')}>
                  {copiedId === 'info-size' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          </div>

          <div className="file-details-right">
            <div className="preview-section">
              <div className="preview-header">
                <div className="preview-actions">
                  <div className="open-dropdown-container" ref={openDropdownRef}>
                    <button className="preview-action-btn" onClick={() => setIsOpenDropdownOpen(!isOpenDropdownOpen)}>
                      <OpenIcon />
                      <span>Open</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    {isOpenDropdownOpen && (
                      <div className="open-dropdown">
                        <button className="open-dropdown-item" onClick={() => { navigate('/apps/hic-qc'); setIsOpenDropdownOpen(false); }}>
                          HIC QC Data
                        </button>
                        <button className="open-dropdown-item" onClick={() => { navigate('/apps/cro-data-review'); setIsOpenDropdownOpen(false); }}>
                          CRO Data Review
                        </button>
                        <button className="open-dropdown-item" onClick={() => { navigate(`/apps/esign/${id}`); setIsOpenDropdownOpen(false); }}>
                          eSignature
                        </button>
                      </div>
                    )}
                  </div>
                  <button className="preview-action-btn">
                    <BookmarkIcon />
                    <span>Bookmark</span>
                  </button>
                  <button className="preview-action-btn">
                    <ShareIcon />
                    <span>Share</span>
                  </button>
                  <button className="preview-action-btn">
                    <DownloadIcon />
                    <span>Download</span>
                  </button>
                  <button className="preview-action-btn">
                    <LineageIcon />
                    <span>Lineage</span>
                  </button>
                  <button className="preview-action-btn" onClick={() => setShowHistory(!showHistory)}>
                    <HistoryIcon />
                    <span>History</span>
                  </button>
                  <button
                    className={`preview-action-btn${showAIAssistant ? ' active' : ''}`}
                    onClick={() => setShowAIAssistant(!showAIAssistant)}
                    title="AI Assistant"
                  >
                    <AIAssistantIcon />
                    <span>AI Assistant</span>
                  </button>
                  <button className="preview-action-btn">
                    <MoreIcon />
                  </button>
                </div>
              </div>
              {isSpreadsheet ? (
                <div className="spreadsheet-layout">
                  <div className="spreadsheet-preview-container">
                    <SpreadsheetViewer data={spreadsheetData} fileName={fileData.name} />
                  </div>
                  <div className="file-assistant-container">
                    <FileAssistant spreadsheetData={spreadsheetData} fileName={fileData.name} onClose={() => setShowAIAssistant(false)} />
                  </div>
                </div>
              ) : (
              <div className={`document-layout${showAIAssistant ? ' with-assistant' : ''}`}>
                <div className="preview-content">
                  {demoFile?.fileType === 'pdf' && demoFile?.signedFileId ? (() => {
                    const parentFile = findDemoFile(demoFile.signedFileId!);
                    const manifest = parentFile?.esignManifest;
                    if (!manifest || !parentFile) return null;
                    const reportId = `rpt-${demoFile.fileId}`;
                    const signedDate = new Date(manifest.timestamp);
                    const assayRows = getMockAssayResults(demoFile.assayType);
                    const reportSignature = {
                      signatureId: `sig-${parentFile.fileId}`,
                      signerId: DEMO_USER.userId,
                      signerName: DEMO_USER.name,
                      meaning: 'Review and Approval' as const,
                      authenticationMethod: 'Username + Password',
                    };
                    return (
                      <div className="signed-file-report-preview">
                        {/* Header */}
                        <div className="report-header">
                          <div className="report-title-row">
                            <h1>eSignature Report &mdash; {demoFile.assayType}</h1>
                          </div>
                          <div className="report-meta-row">
                            <span>Report ID: <strong>{reportId}</strong></span>
                            <span>Generated: <strong>{signedDate.toLocaleString()}</strong></span>
                          </div>
                        </div>
                        {/* File Info */}
                        <div className="report-section">
                          <h2>File Summary</h2>
                          <div className="report-grid">
                            <div className="report-field">
                              <span className="report-label">Source File</span>
                              <span className="report-value">{parentFile.fileName}</span>
                            </div>
                            <div className="report-field">
                              <span className="report-label">Assay Type</span>
                              <span className="report-value">{demoFile.assayType}</span>
                            </div>
                            <div className="report-field">
                              <span className="report-label">Source System</span>
                              <span className="report-value">{parentFile.sourceSystem}</span>
                            </div>
                            <div className="report-field">
                              <span className="report-label">Version</span>
                              <span className="report-value">{parentFile.versionId}</span>
                            </div>
                            <div className="report-field full-width">
                              <span className="report-label">SHA-256 Hash</span>
                              <span className="report-value hash">{parentFile.sha256}</span>
                            </div>
                          </div>
                        </div>
                        {/* Assay Results */}
                        <div className="report-section">
                          <h2>Assay Results</h2>
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
                              {assayRows.map((r, idx) => (
                                <tr key={idx}>
                                  <td>{r.sample}</td>
                                  <td>{r.analyte}</td>
                                  <td>{r.result}</td>
                                  <td>{r.unit}</td>
                                  <td>{r.spec}</td>
                                  <td>
                                    <span className={`report-result-status ${r.status.toLowerCase()}`}>{r.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p className="report-result-summary">
                            {assayRows.length} results &mdash; {assayRows.filter(r => r.status === 'Pass').length} passed,{' '}
                            {assayRows.filter(r => r.status === 'Fail').length} failed
                          </p>
                        </div>
                        {/* Signature Block */}
                        <div className="report-section report-signature-block">
                          <h2>Electronic Signature</h2>
                          <div className="report-grid">
                            <div className="report-field">
                              <span className="report-label">Signer</span>
                              <span className="report-value">{reportSignature.signerName}</span>
                            </div>
                            <div className="report-field">
                              <span className="report-label">User ID</span>
                              <span className="report-value">{reportSignature.signerId}</span>
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
                              <span className="report-value report-meaning">{reportSignature.meaning}</span>
                            </div>
                            <div className="report-field">
                              <span className="report-label">Authentication Method</span>
                              <span className="report-value">{reportSignature.authenticationMethod}</span>
                            </div>
                            <div className="report-field">
                              <span className="report-label">Date &amp; Time</span>
                              <span className="report-value">{signedDate.toLocaleDateString()} {signedDate.toLocaleTimeString()}</span>
                            </div>
                            <div className="report-field">
                              <span className="report-label">Dataset Version</span>
                              <span className="report-value">{manifest.version}</span>
                            </div>
                            <div className="report-field full-width">
                              <span className="report-label">Signature ID</span>
                              <span className="report-value hash">{reportSignature.signatureId}</span>
                            </div>
                          </div>
                        </div>
                        {/* Footer */}
                        <div className="report-footer">
                          <p>This report was electronically generated and signed via the TetraScience Data Platform.</p>
                          <p>Report ID: {reportId} &bull; Dataset Version: {manifest.version}</p>
                        </div>
                      </div>
                    );
                  })() : !fileData.sourceLocation.includes('chromatography') ? (
                    <>
                      <button className="preview-copy-btn" onClick={() => handleCopy('Proteomics-Study3-Protocol.txt', 'preview-copy')}>
                        {copiedId === 'preview-copy' ? <CheckIcon /> : <CopyIcon />}
                      </button>
                      <div className="preview-title"># Proteomics Study 3 - Experimental Protocol</div>
                      <div className="preview-text">
                  <p className="separator">================================================================================</p>
                  <p><strong>PROTEOMICS STUDY 3: COMPARATIVE PROTEIN EXPRESSION ANALYSIS</strong></p>
                  <p className="separator">================================================================================</p>
                  <p>&nbsp;</p>
                  <p><strong>STUDY INFORMATION</strong></p>
                  <p>-----------</p>
                  <p>Study ID: PS3-2026-001</p>
                  <p>Principal Investigator: Dr. Sarah Chen</p>
                  <p>Lab: Proteomics Research Center</p>
                  <p>Institution: TetraScience Molecular Biology Institute</p>
                  <p>Protocol Version: 2.1</p>
                  <p>Date Created: 01/05/2026</p>
                  <p>Last Modified: 01/09/2026</p>
                  <p>Status: Active</p>
                  <p>&nbsp;</p>
                  <p><strong>STUDY OBJECTIVE:</strong></p>
                  <p>-----------</p>
                  <p>To perform comprehensive proteomic profiling of cancer cell lines treated with</p>
                  <p>experimental therapeutic compound TS-3847 compared to vehicle controls. This study</p>
                  <p>aims to identify differentially expressed proteins and elucidate the molecular</p>
                  <p>mechanisms of action for this novel anti-cancer agent. The proteomics data will</p>
                  <p>inform downstream pathway analysis and identify potential biomarkers for clinical</p>
                  <p>development.</p>
                  <p>&nbsp;</p>
                  <p><strong>SAMPLE INFORMATION:</strong></p>
                  <p>-----------</p>
                  <p>Cell Line: A549 (human lung carcinoma)</p>
                  <p>Source: ATCC CCL-185</p>
                  <p>Passage Range: P15-P20</p>
                  <p>Culture Medium: RPMI-1640 + 10% FBS + 1% Pen/Strep</p>
                  <p>Sample Groups:</p>
                  <p>  - Group A: Vehicle Control (DMSO 0.1%) - 6 biological replicates</p>
                  <p>  - Group B: TS-3847 Treatment (10µM) - 6 biological replicates</p>
                  <p>Total Samples: 12</p>
                  <p>&nbsp;</p>
                  <p><strong>MATERIALS AND REAGENTS:</strong></p>
                  <p>-----------</p>
                  <p>Reagents:</p>
                  <p>  - TS-3847 compound (10mM stock in DMSO)</p>
                  <p>  - DMSO (molecular biology grade)</p>
                  <p>  - RIPA lysis buffer (Thermo Fisher #89900)</p>
                  <p>  - Protease inhibitor cocktail (Roche cOmplete Mini)</p>
                  <p>  - Phosphatase inhibitor cocktail (Sigma PhosSTOP)</p>
                  <p>  - BCA protein assay kit (Pierce #23225)</p>
                  <p>  - Trypsin/Lys-C mix (Promega V5073)</p>
                  <p>  - TMT 11-plex isobaric labeling kit (Thermo Fisher #A34808)</p>
                  <p>  - C18 Sep-Pak cartridges (Waters WAT054955)</p>
                  <p>  - Acetonitrile (LC-MS grade)</p>
                  <p>  - Formic acid (LC-MS grade)</p>
                  <p>&nbsp;</p>
                  <p>Equipment:</p>
                  <p>  - Orbitrap Fusion Lumos Tribrid Mass Spectrometer (Thermo Fisher)</p>
                  <p>  - EASY-nLC 1200 UHPLC system (Thermo Fisher)</p>
                  <p>  - Acclaim PepMap RSLC C18 column (75µm x 50cm, 2µm particles)</p>
                  <p>  - Centrifuge (Eppendorf 5424R)</p>
                  <p>  - SpeedVac concentrator (Thermo Savant)</p>
                  <p>  - pH meter</p>
                  <p>  - Vortex mixer</p>
                  <p>  - -80°C freezer</p>
                  <p>&nbsp;</p>
                  <p><strong>EXPERIMENTAL PROCEDURE:</strong></p>
                  <p>-----------</p>
                  <p>&nbsp;</p>
                  <p>Day 1 - Cell Culture and Treatment:</p>
                  <p>1. Seed A549 cells at 2x10^6 cells per 10cm dish</p>
                  <p>2. Culture overnight in RPMI-1640 + 10% FBS at 37°C, 5% CO2</p>
                  <p>3. Verify cell confluency reaches 70-80%</p>
                  <p>4. Prepare treatment solutions:</p>
                  <p>   - Vehicle control: DMSO diluted to 0.1% in culture medium</p>
                  <p>   - TS-3847 treatment: 10µM final concentration in culture medium</p>
                  <p>5. Replace medium with treatment solutions (10mL per dish)</p>
                  <p>6. Incubate for 48 hours</p>
                  <p>&nbsp;</p>
                  <p>Day 3 - Cell Harvest and Lysis:</p>
                  <p>1. Remove culture medium and wash cells 3x with ice-cold PBS</p>
                  <p>2. Add 500µL RIPA buffer + protease/phosphatase inhibitors per dish</p>
                  <p>3. Scrape cells and transfer to pre-chilled 1.5mL tubes</p>
                  <p>4. Incubate on ice for 30 minutes with vortexing every 10 min</p>
                  <p>5. Centrifuge at 14,000 x g for 15 min at 4°C</p>
                  <p>6. Transfer supernatant to fresh tubes, discard pellet</p>
                  <p>7. Measure protein concentration using BCA assay</p>
                  <p>8. Normalize all samples to 2 mg/mL</p>
                  <p>9. Aliquot 100µg protein per sample, store at -80°C</p>
                  <p>&nbsp;</p>
                  <p>Day 4 - Protein Digestion:</p>
                  <p>1. Thaw protein samples on ice</p>
                  <p>2. Reduce disulfide bonds with 5mM DTT at 56°C for 30 min</p>
                  <p>3. Alkylate cysteines with 15mM iodoacetamide at RT for 30 min in dark</p>
                  <p>4. Quench with additional 5mM DTT</p>
                  <p>5. Add trypsin/Lys-C mix at 1:50 enzyme:protein ratio</p>
                  <p>6. Digest overnight at 37°C with gentle shaking</p>
                  <p>7. Quench digestion with 1% formic acid</p>
                  <p>8. Desalt peptides using C18 Sep-Pak cartridges</p>
                  <p>9. Dry peptides in SpeedVac</p>
                  <p>&nbsp;</p>
                  <p>Day 5 - TMT Labeling:</p>
                  <p>1. Reconstitute peptides in 100µL of 100mM TEAB buffer</p>
                  <p>2. Label samples with TMT 11-plex reagents according to scheme:</p>
                  <p>   - TMT-126: Control replicate 1</p>
                  <p>   - TMT-127N: Control replicate 2</p>
                  <p>   - TMT-127C: Control replicate 3</p>
                  <p>   - TMT-128N: Control replicate 4</p>
                  <p>   - TMT-128C: Control replicate 5</p>
                  <p>   - TMT-129N: Control replicate 6</p>
                  <p>   - TMT-129C: Treatment replicate 1</p>
                  <p>   - TMT-130N: Treatment replicate 2</p>
                  <p>   - TMT-130C: Treatment replicate 3</p>
                  <p>   - TMT-131N: Treatment replicate 4</p>
                  <p>   - TMT-131C: Treatment replicate 5</p>
                  <p>3. Incubate at RT for 1 hour</p>
                  <p>4. Quench with 5% hydroxylamine for 15 min</p>
                  <p>5. Combine all labeled samples into one tube</p>
                  <p>6. Desalt and dry in SpeedVac</p>
                  <p>&nbsp;</p>
                  <p>Day 6 - LC-MS/MS Analysis:</p>
                  <p>1. Reconstitute peptides in 0.1% formic acid</p>
                  <p>2. Load 2µg peptides onto Acclaim PepMap trap column</p>
                  <p>3. Separate on 50cm C18 analytical column using 180 min gradient:</p>
                  <p>   - 0-5 min: 3% B</p>
                  <p>   - 5-140 min: 3-28% B</p>
                  <p>   - 140-160 min: 28-40% B</p>
                  <p>   - 160-165 min: 40-80% B</p>
                  <p>   - 165-170 min: 80% B</p>
                  <p>   - 170-180 min: 3% B (re-equilibration)</p>
                  <p>   Mobile phase A: 0.1% formic acid in water</p>
                  <p>   Mobile phase B: 0.1% formic acid in 80% acetonitrile</p>
                  <p>4. MS parameters (Orbitrap Fusion Lumos):</p>
                  <p>   - MS1 scan: 120,000 resolution, 400-1600 m/z, AGC 4e5, 50ms max IT</p>
                  <p>   - MS2 scan: CID fragmentation, 35% collision energy</p>
                  <p>   - MS3 scan: HCD fragmentation for TMT quantification</p>
                  <p>   - Top speed mode with 3 second cycle time</p>
                  <p>&nbsp;</p>
                  <p><strong>DATA ANALYSIS:</strong></p>
                  <p>-----------</p>
                  <p>1. Raw data processing with Proteome Discoverer 2.5</p>
                  <p>2. Database search against UniProt human proteome (reviewed entries)</p>
                  <p>3. Search parameters:</p>
                  <p>   - Enzyme: Trypsin, max 2 missed cleavages</p>
                  <p>   - Fixed modifications: Carbamidomethyl (C), TMT6plex (N-term, K)</p>
                  <p>   - Variable modifications: Oxidation (M), Acetyl (Protein N-term)</p>
                  <p>   - Precursor mass tolerance: 10 ppm</p>
                  <p>   - Fragment mass tolerance: 0.6 Da</p>
                  <p>   - FDR: 1% at peptide and protein level</p>
                  <p>4. Statistical analysis in Perseus software</p>
                  <p>5. Pathway enrichment analysis using DAVID and STRING</p>
                  <p>&nbsp;</p>
                  <p><strong>EXPECTED DELIVERABLES:</strong></p>
                  <p>-----------</p>
                  <p>1. Raw MS data files (.raw format) - 12 files</p>
                  <p>2. Processed peptide identification files (.msf)</p>
                  <p>3. Protein quantification matrix (Excel)</p>
                  <p>4. Quality control report (PDF)</p>
                  <p>5. Differential expression analysis results</p>
                  <p>6. Pathway enrichment analysis results</p>
                  <p>7. Final study report with figures</p>
                  <p>&nbsp;</p>
                  <p><strong>DATA STORAGE:</strong></p>
                  <p>-----------</p>
                  <p>Raw data: /tetrasphere/proteomics/study-3/samples/</p>
                  <p>Processed data: /tetrasphere/proteomics/study-3/processed/</p>
                  <p>Analysis results: /tetrasphere/proteomics/study-3/analysis/</p>
                  <p>Documentation: /tetrasphere/proteomics/study-3/docs/</p>
                  <p>&nbsp;</p>
                  <p><strong>TIMELINE:</strong></p>
                  <p>-----------</p>
                  <p>Sample preparation: 01/06/2026 - 01/08/2026</p>
                  <p>MS data acquisition: 01/10/2026 - 01/12/2026</p>
                  <p>Data analysis: 01/13/2026 - 01/20/2026</p>
                  <p>Report generation: 01/21/2026 - 01/25/2026</p>
                  <p>&nbsp;</p>
                  <p className="separator">================================================================================</p>
                  <p>End of Protocol Document</p>
                  <p className="separator">================================================================================</p>
                </div>
                    </>
                  ) : (
                    <div className="preview-text" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <p>Preview not available for this file type.</p>
                      <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Use the "Download" or "Open" button above to view the file contents.</p>
                    </div>
                  )}
                </div>
                {showAIAssistant && (
                  <div className="file-assistant-container">
                    <FileAssistant fileName={fileData.name} onClose={() => setShowAIAssistant(false)} />
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
        </div>

        {showHistory && (
          <div className="history-sidebar">
            <div className="history-header">
              <h3>History</h3>
              <button className="close-history-btn" onClick={() => setShowHistory(false)}>
                <CloseIcon />
              </button>
            </div>

            <div className="history-content">
              <h4>All versions</h4>
              <div className="version-item">
                <div className="version-info">
                  <div className="version-name">Proteomics-Study3-Protocol-v2.1.txt</div>
                  <div className="version-meta">01/09/2026 4:30 PM</div>
                </div>
                <button className="download-version-btn">
                  <DownloadIcon />
                </button>
              </div>

              <h4>Related files</h4>
              <div className="related-section">
                <h5>Sample Data Files</h5>
                <div className="related-file">
                  <div className="related-file-name">Proteomics-Study3-Sample-A1.raw</div>
                  <div className="related-file-type">MS Data File</div>
                  <button className="copy-btn" onClick={() => handleCopy('Proteomics-Study3-Sample-A1.raw', 'related-sample-1')}>
                    {copiedId === 'related-sample-1' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                <div className="related-file">
                  <div className="related-file-name">Proteomics-Study3-Sample-A2.raw</div>
                  <div className="related-file-type">MS Data File</div>
                  <button className="copy-btn" onClick={() => handleCopy('Proteomics-Study3-Sample-A2.raw', 'related-sample-2')}>
                    {copiedId === 'related-sample-2' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                <div className="related-file">
                  <div className="related-file-name">Proteomics-Study3-Control-C1.raw</div>
                  <div className="related-file-type">MS Data File</div>
                  <button className="copy-btn" onClick={() => handleCopy('Proteomics-Study3-Control-C1.raw', 'related-control-1')}>
                    {copiedId === 'related-control-1' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>

              <div className="related-section">
                <h5>Metadata</h5>
                <div className="related-file">
                  <div className="related-file-name">Proteomics-Study3-Metadata.csv</div>
                  <div className="related-file-type">Metadata File</div>
                  <button className="copy-btn" onClick={() => handleCopy('Proteomics-Study3-Metadata.csv', 'related-metadata')}>
                    {copiedId === 'related-metadata' ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileDetailsPage;

