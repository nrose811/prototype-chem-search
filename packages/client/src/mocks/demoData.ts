// ============================================================
// e-Signature Prototype — Mock Data
// ============================================================

export interface DemoUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

export interface FileManifestItem {
  fileId: string;
  fileName: string;
  sourceSystem: string;
  versionId: string;
  sha256: string;
  assayType: string;
  uploadedAt: string;
}

export interface AssayResult {
  fileId: string;
  sampleId: string;
  analyte: string;
  result: number;
  unit: string;
  specification: string;
  status: 'Pass' | 'Fail' | 'Pending';
}

export interface HistoricalDataPoint {
  batchId: string;
  analyte: string;
  result: number;
  date: string;
  isCurrent: boolean;
}

export interface BatchReview {
  batchId: string;
  batchName: string;
  croName: string;
  studyId: string;
  projectName: string;
  appVersion: string;
  datasetVersion: string;
  status: 'PENDING_SIGNATURE' | 'SIGNED';
  receivedAt: string;
  files: FileManifestItem[];
  assayResults: AssayResult[];
}

export interface SignatureRecord {
  signatureId: string;
  signerId: string;
  signerName: string;
  timestamp: string;
  timezone: string;
  meaning: string;
  authenticationMethod: string;
  datasetVersion: string;
  reportId: string;
  status: 'APPLIED' | 'FAILED' | 'REVOKED';
  batchId: string;
}

export interface AuditEvent {
  eventId: string;
  eventType: string;
  userId: string;
  userName: string;
  userRole?: string;
  userIp?: string;
  timestamp: string;
  result: 'SUCCESS' | 'FAILURE';
  datasetVersion: string;
  reason: string;
  origin: string;
  entityName?: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, string>;
}

// -- Signature meaning options --
export const SIGNATURE_MEANINGS = [
  'Review and Approval',
  'Verified for Accuracy',
  'Acknowledged',
] as const;

export type SignatureMeaning = (typeof SIGNATURE_MEANINGS)[number];

// -- Demo user --
export const DEMO_USER: DemoUser = {
  userId: 'usr-sc-001',
  name: 'Dr. Sarah Chen',
  email: 'schen@pharma.com',
  role: 'Scientific Reviewer',
  organization: 'Pharma Corp',
};

// -- Demo password (for mock auth) --
export const DEMO_PASSWORD = 'password123';

// -- File manifest --
const FILES: FileManifestItem[] = [
  {
    fileId: 'file-001',
    fileName: 'CRO-Alpha-Potency-Assay-Batch42.json',
    sourceSystem: 'Empower CDS',
    versionId: 'v3',
    sha256: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    assayType: 'Potency',
    uploadedAt: '2026-03-15T14:30:00Z',
  },
  {
    fileId: 'file-002',
    fileName: 'CRO-Alpha-Purity-HPLC-Batch42.json',
    sourceSystem: 'Empower CDS',
    versionId: 'v3',
    sha256: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
    assayType: 'Purity',
    uploadedAt: '2026-03-15T14:32:00Z',
  },
  {
    fileId: 'file-003',
    fileName: 'CRO-Alpha-Identity-MS-Batch42.json',
    sourceSystem: 'MassLynx',
    versionId: 'v2',
    sha256: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    assayType: 'Identity',
    uploadedAt: '2026-03-15T14:35:00Z',
  },
  {
    fileId: 'file-004',
    fileName: 'CRO-Alpha-Stability-Batch42.json',
    sourceSystem: 'Empower CDS',
    versionId: 'v1',
    sha256: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
    assayType: 'Stability',
    uploadedAt: '2026-03-15T14:38:00Z',
  },
];



// -- Assay results --
const ASSAY_RESULTS: AssayResult[] = [
  { fileId: 'file-001', sampleId: 'S-042-01', analyte: 'Active Compound A', result: 99.2, unit: '%', specification: '95.0 - 105.0%', status: 'Pass' },
  { fileId: 'file-001', sampleId: 'S-042-02', analyte: 'Active Compound A', result: 98.7, unit: '%', specification: '95.0 - 105.0%', status: 'Pass' },
  { fileId: 'file-001', sampleId: 'S-042-03', analyte: 'Active Compound A', result: 100.1, unit: '%', specification: '95.0 - 105.0%', status: 'Pass' },
  { fileId: 'file-002', sampleId: 'S-042-01', analyte: 'Impurity B', result: 0.12, unit: '%', specification: '<= 0.5%', status: 'Pass' },
  { fileId: 'file-002', sampleId: 'S-042-02', analyte: 'Impurity B', result: 0.09, unit: '%', specification: '<= 0.5%', status: 'Pass' },
  { fileId: 'file-002', sampleId: 'S-042-03', analyte: 'Total Impurities', result: 0.35, unit: '%', specification: '<= 2.0%', status: 'Pass' },
  { fileId: 'file-003', sampleId: 'S-042-01', analyte: 'MW Confirmation', result: 384.2, unit: 'Da', specification: '384.2 +/- 0.5 Da', status: 'Pass' },
  { fileId: 'file-004', sampleId: 'S-042-01', analyte: 'Active Compound A (T=0)', result: 99.5, unit: '%', specification: '>= 95.0%', status: 'Pass' },
  { fileId: 'file-004', sampleId: 'S-042-01', analyte: 'Active Compound A (T=3mo)', result: 98.8, unit: '%', specification: '>= 95.0%', status: 'Pass' },
];

// -- Historical comparison data --
export const HISTORICAL_DATA: HistoricalDataPoint[] = [
  { batchId: 'Batch-38', analyte: 'Active Compound A', result: 98.5, date: '2025-09-10', isCurrent: false },
  { batchId: 'Batch-39', analyte: 'Active Compound A', result: 99.0, date: '2025-10-15', isCurrent: false },
  { batchId: 'Batch-40', analyte: 'Active Compound A', result: 97.8, date: '2025-11-20', isCurrent: false },
  { batchId: 'Batch-41', analyte: 'Active Compound A', result: 100.3, date: '2026-01-05', isCurrent: false },
  { batchId: 'Batch-42', analyte: 'Active Compound A', result: 99.2, date: '2026-03-15', isCurrent: true },
  { batchId: 'Batch-38', analyte: 'Impurity B', result: 0.15, date: '2025-09-10', isCurrent: false },
  { batchId: 'Batch-39', analyte: 'Impurity B', result: 0.11, date: '2025-10-15', isCurrent: false },
  { batchId: 'Batch-40', analyte: 'Impurity B', result: 0.18, date: '2025-11-20', isCurrent: false },
  { batchId: 'Batch-41', analyte: 'Impurity B', result: 0.10, date: '2026-01-05', isCurrent: false },
  { batchId: 'Batch-42', analyte: 'Impurity B', result: 0.12, date: '2026-03-15', isCurrent: true },
];

// -- CRO Batch --
export const DEMO_BATCH: BatchReview = {
  batchId: 'batch-042',
  batchName: 'CRO Alpha — Batch 42',
  croName: 'CRO Alpha Laboratories',
  studyId: 'STUDY-2026-007',
  projectName: 'Compound A Release Testing',
  appVersion: 'v1.4.0',
  datasetVersion: 'ds-v3.0',
  status: 'PENDING_SIGNATURE',
  receivedAt: '2026-03-15T14:30:00Z',
  files: FILES,
  assayResults: ASSAY_RESULTS,
};

// -- Pre-seeded audit events --
export const SEED_AUDIT_EVENTS: AuditEvent[] = [
  {
    eventId: 'evt-010',
    eventType: 'Upload',
    userId: 'system',
    userName: 'TetraScience Platform',
    userRole: 'System',
    userIp: '10.176.2.100',
    timestamp: '2026-03-15T14:28:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: '',
    origin: 'Pipeline: CRO-Alpha-Ingestion',
    entityName: 'CRO-Alpha-Potency-Assay-Batch42.json',
    entityType: 'File',
    entityId: 'file-001',
  },
  {
    eventId: 'evt-011',
    eventType: 'Upload',
    userId: 'system',
    userName: 'TetraScience Platform',
    userRole: 'System',
    userIp: '10.176.2.100',
    timestamp: '2026-03-15T14:29:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: '',
    origin: 'Pipeline: CRO-Alpha-Ingestion',
    entityName: 'CRO-Alpha-Purity-HPLC-Batch42.json',
    entityType: 'File',
    entityId: 'file-002',
  },
  {
    eventId: 'evt-012',
    eventType: 'Upload',
    userId: 'system',
    userName: 'TetraScience Platform',
    userRole: 'System',
    userIp: '10.176.2.100',
    timestamp: '2026-03-15T14:30:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: '',
    origin: 'Pipeline: CRO-Alpha-Ingestion',
    entityName: 'CRO-Alpha-Identity-MS-Batch42.json',
    entityType: 'File',
    entityId: 'file-003',
  },
  {
    eventId: 'evt-013',
    eventType: 'Upload',
    userId: 'system',
    userName: 'TetraScience Platform',
    userRole: 'System',
    userIp: '10.176.2.100',
    timestamp: '2026-03-15T14:31:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: '',
    origin: 'Pipeline: CRO-Alpha-Ingestion',
    entityName: 'CRO-Alpha-Stability-Batch42.json',
    entityType: 'File',
    entityId: 'file-004',
  },
  {
    eventId: 'evt-001',
    eventType: 'Data Ingestion',
    userId: 'system',
    userName: 'TetraScience Platform',
    userRole: 'System',
    userIp: '10.176.2.100',
    timestamp: '2026-03-15T14:32:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: 'CRO data ingestion completed',
    origin: 'Pipeline: CRO-Alpha-Ingestion',
    entityName: 'CRO Alpha -- Batch 42',
    entityType: 'Batch',
    entityId: 'batch-042',
    details: { filesIngested: '4', sourceSystem: 'Empower CDS, MassLynx' },
  },
  {
    eventId: 'evt-014',
    eventType: 'Update Labels',
    userId: 'system',
    userName: 'TetraScience Platform',
    userRole: 'System',
    userIp: '10.176.2.100',
    timestamp: '2026-03-15T14:33:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: 'Auto-labeled from pipeline metadata',
    origin: 'Pipeline: CRO-Alpha-Ingestion',
    entityName: 'CRO-Alpha-Potency-Assay-Batch42.json',
    entityType: 'File',
    entityId: 'file-001',
  },
  {
    eventId: 'evt-015',
    eventType: 'Update Labels',
    userId: 'system',
    userName: 'TetraScience Platform',
    userRole: 'System',
    userIp: '10.176.2.100',
    timestamp: '2026-03-15T14:33:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: 'Auto-labeled from pipeline metadata',
    origin: 'Pipeline: CRO-Alpha-Ingestion',
    entityName: 'CRO-Alpha-Purity-HPLC-Batch42.json',
    entityType: 'File',
    entityId: 'file-002',
  },
  {
    eventId: 'evt-002',
    eventType: 'Review Assigned',
    userId: 'usr-sc-001',
    userName: 'Dr. Sarah Chen',
    userRole: 'Scientific Reviewer',
    userIp: '47.220.172.63',
    timestamp: '2026-03-15T15:00:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: 'Auto-assigned based on study ownership',
    origin: 'Workflow Engine',
    entityName: 'CRO Alpha -- Batch 42',
    entityType: 'Batch',
    entityId: 'batch-042',
  },
  {
    eventId: 'evt-016',
    eventType: 'Download',
    userId: 'usr-sc-001',
    userName: 'Dr. Sarah Chen',
    userRole: 'Scientific Reviewer',
    userIp: '47.220.172.63',
    timestamp: '2026-03-16T09:12:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: '',
    origin: 'Tetra Data Platform',
    entityName: 'CRO-Alpha-Potency-Assay-Batch42.json',
    entityType: 'File',
    entityId: 'file-001',
  },
  {
    eventId: 'evt-017',
    eventType: 'Download',
    userId: 'usr-sc-001',
    userName: 'Dr. Sarah Chen',
    userRole: 'Scientific Reviewer',
    userIp: '47.220.172.63',
    timestamp: '2026-03-16T09:12:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: '',
    origin: 'Tetra Data Platform',
    entityName: 'CRO-Alpha-Purity-HPLC-Batch42.json',
    entityType: 'File',
    entityId: 'file-002',
  },
  {
    eventId: 'evt-003',
    eventType: 'Review Opened',
    userId: 'usr-sc-001',
    userName: 'Dr. Sarah Chen',
    userRole: 'Scientific Reviewer',
    userIp: '47.220.172.63',
    timestamp: '2026-03-16T09:15:00Z',
    result: 'SUCCESS',
    datasetVersion: 'ds-v3.0',
    reason: 'Reviewer accessed CRO Data Review app',
    origin: 'CRO Data Review App v1.4.0',
    entityName: 'CRO Alpha -- Batch 42',
    entityType: 'Batch',
    entityId: 'batch-042',
  },
];