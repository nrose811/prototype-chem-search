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

// ============================================================
// HIC QC Data App — Mock Data
// ============================================================

export interface HicPeakColumn {
  area: number | null;
  rt: number | null;
  hydro_id: string | null;
}

export interface HicSampleRow {
  sample_id: string;
  sample_set_id: string | null;
  sample_set_name: string | null;
  qc_status: string | null;
  injection_time: string | null;
  sample_name: string | null;
  concentration: number | null;
  batch_id: string | null;
  target_product_protein_name: string | null;
  system_name: string | null;
  hydro_id: string | null;
  channel_name: string | null;
  peak_1: HicPeakColumn | null;
  peak_2: HicPeakColumn | null;
  peak_3: HicPeakColumn | null;
  peak_4: HicPeakColumn | null;
  peak_5: HicPeakColumn | null;
  peak_6: HicPeakColumn | null;
}

export interface HicSampleSet {
  sample_set_id: string;
  sample_set_name: string | null;
  system_name: string | null;
  samples: HicSampleRow[];
}

export interface ChromatogramSeries {
  label: string;
  time: number[];
  intensity: number[];
}

// Helper to generate a simple gaussian-ish peak
function gaussianPeak(center: number, height: number, width: number, points: number[]): number[] {
  return points.map((t) => height * Math.exp(-0.5 * ((t - center) / width) ** 2));
}

function generateTime(start: number, end: number, step: number): number[] {
  const arr: number[] = [];
  for (let t = start; t <= end; t += step) arr.push(Math.round(t * 100) / 100);
  return arr;
}

const HIC_TIME = generateTime(0, 30, 0.1);

function buildChromatogram(peaks: { center: number; height: number; width: number }[]): number[] {
  const baseline = HIC_TIME.map(() => Math.random() * 2);
  for (const p of peaks) {
    const g = gaussianPeak(p.center, p.height, p.width, HIC_TIME);
    for (let i = 0; i < baseline.length; i++) baseline[i] += g[i];
  }
  return baseline.map((v) => Math.round(v * 10) / 10);
}

// -- HIC Sample Sets --
export const HIC_SAMPLE_SETS: HicSampleSet[] = [
  {
    sample_set_id: 'ss-001',
    sample_set_name: 'mAb-A Lot 2026-03',
    system_name: 'Agilent 1260 Infinity II',
    samples: [
      {
        sample_id: 'hic-s-001', sample_set_id: 'ss-001', sample_set_name: 'mAb-A Lot 2026-03',
        qc_status: 'Pass', injection_time: '2026-03-10T08:15:00Z',
        sample_name: 'mAb-A Sample 1', concentration: 5.0, batch_id: 'LOT-2026-03',
        target_product_protein_name: 'mAb-A', system_name: 'Agilent 1260 Infinity II',
        hydro_id: 'Low', channel_name: '280 nm',
        peak_1: { area: 85.2, rt: 4.3, hydro_id: 'Low' },
        peak_2: { area: 10.1, rt: 7.8, hydro_id: 'Medium' },
        peak_3: { area: 4.7, rt: 12.1, hydro_id: 'High' },
        peak_4: null, peak_5: null, peak_6: null,
      },
      {
        sample_id: 'hic-s-002', sample_set_id: 'ss-001', sample_set_name: 'mAb-A Lot 2026-03',
        qc_status: 'Pass', injection_time: '2026-03-10T08:45:00Z',
        sample_name: 'mAb-A Sample 2', concentration: 5.0, batch_id: 'LOT-2026-03',
        target_product_protein_name: 'mAb-A', system_name: 'Agilent 1260 Infinity II',
        hydro_id: 'Low', channel_name: '280 nm',
        peak_1: { area: 86.0, rt: 4.4, hydro_id: 'Low' },
        peak_2: { area: 9.8, rt: 7.7, hydro_id: 'Medium' },
        peak_3: { area: 4.2, rt: 12.0, hydro_id: 'High' },
        peak_4: null, peak_5: null, peak_6: null,
      },
      {
        sample_id: 'hic-s-003', sample_set_id: 'ss-001', sample_set_name: 'mAb-A Lot 2026-03',
        qc_status: 'Pass', injection_time: '2026-03-10T09:15:00Z',
        sample_name: 'mAb-A Sample 3', concentration: 5.0, batch_id: 'LOT-2026-03',
        target_product_protein_name: 'mAb-A', system_name: 'Agilent 1260 Infinity II',
        hydro_id: 'Low', channel_name: '280 nm',
        peak_1: { area: 84.8, rt: 4.3, hydro_id: 'Low' },
        peak_2: { area: 10.5, rt: 7.9, hydro_id: 'Medium' },
        peak_3: { area: 4.7, rt: 12.2, hydro_id: 'High' },
        peak_4: null, peak_5: null, peak_6: null,
      },
    ],
  },
  {
    sample_set_id: 'ss-002',
    sample_set_name: 'mAb-B Lot 2026-02',
    system_name: 'Waters Alliance e2695',
    samples: [
      {
        sample_id: 'hic-s-004', sample_set_id: 'ss-002', sample_set_name: 'mAb-B Lot 2026-02',
        qc_status: 'Fail', injection_time: '2026-03-11T10:00:00Z',
        sample_name: 'mAb-B Sample 1', concentration: 10.0, batch_id: 'LOT-2026-02',
        target_product_protein_name: 'mAb-B', system_name: 'Waters Alliance e2695',
        hydro_id: 'High', channel_name: '215 nm',
        peak_1: { area: 42.5, rt: 5.1, hydro_id: 'Low' },
        peak_2: { area: 18.3, rt: 8.4, hydro_id: 'Medium' },
        peak_3: { area: 25.0, rt: 13.7, hydro_id: 'High' },
        peak_4: { area: 14.2, rt: 18.2, hydro_id: 'High' },
        peak_5: null, peak_6: null,
      },
      {
        sample_id: 'hic-s-005', sample_set_id: 'ss-002', sample_set_name: 'mAb-B Lot 2026-02',
        qc_status: 'Inconclusive', injection_time: '2026-03-11T10:30:00Z',
        sample_name: 'mAb-B Sample 2', concentration: 10.0, batch_id: 'LOT-2026-02',
        target_product_protein_name: 'mAb-B', system_name: 'Waters Alliance e2695',
        hydro_id: 'Medium', channel_name: '215 nm',
        peak_1: { area: 55.1, rt: 5.0, hydro_id: 'Low' },
        peak_2: { area: 22.7, rt: 8.6, hydro_id: 'Medium' },
        peak_3: { area: 22.2, rt: 13.5, hydro_id: 'High' },
        peak_4: null, peak_5: null, peak_6: null,
      },
    ],
  },
  {
    sample_set_id: 'ss-003',
    sample_set_name: 'mAb-A Lot 2026-04',
    system_name: 'Agilent 1260 Infinity II',
    samples: [
      {
        sample_id: 'hic-s-006', sample_set_id: 'ss-003', sample_set_name: 'mAb-A Lot 2026-04',
        qc_status: 'Pass', injection_time: '2026-03-14T14:00:00Z',
        sample_name: 'mAb-A Sample 4', concentration: 5.0, batch_id: 'LOT-2026-04',
        target_product_protein_name: 'mAb-A', system_name: 'Agilent 1260 Infinity II',
        hydro_id: 'Low', channel_name: '280 nm',
        peak_1: { area: 87.1, rt: 4.2, hydro_id: 'Low' },
        peak_2: { area: 9.2, rt: 7.6, hydro_id: 'Medium' },
        peak_3: { area: 3.7, rt: 11.9, hydro_id: 'High' },
        peak_4: null, peak_5: null, peak_6: null,
      },
    ],
  },
];

// -- Mock chromatogram data for each sample --
export const HIC_CHROMATOGRAMS: Record<string, ChromatogramSeries> = {
  'hic-s-001': { label: 'mAb-A Sample 1', time: HIC_TIME, intensity: buildChromatogram([{ center: 4.3, height: 850, width: 0.6 }, { center: 7.8, height: 100, width: 0.5 }, { center: 12.1, height: 47, width: 0.7 }]) },
  'hic-s-002': { label: 'mAb-A Sample 2', time: HIC_TIME, intensity: buildChromatogram([{ center: 4.4, height: 860, width: 0.6 }, { center: 7.7, height: 98, width: 0.5 }, { center: 12.0, height: 42, width: 0.7 }]) },
  'hic-s-003': { label: 'mAb-A Sample 3', time: HIC_TIME, intensity: buildChromatogram([{ center: 4.3, height: 848, width: 0.6 }, { center: 7.9, height: 105, width: 0.5 }, { center: 12.2, height: 47, width: 0.7 }]) },
  'hic-s-004': { label: 'mAb-B Sample 1', time: HIC_TIME, intensity: buildChromatogram([{ center: 5.1, height: 425, width: 0.7 }, { center: 8.4, height: 183, width: 0.6 }, { center: 13.7, height: 250, width: 0.8 }, { center: 18.2, height: 142, width: 0.7 }]) },
  'hic-s-005': { label: 'mAb-B Sample 2', time: HIC_TIME, intensity: buildChromatogram([{ center: 5.0, height: 551, width: 0.7 }, { center: 8.6, height: 227, width: 0.6 }, { center: 13.5, height: 222, width: 0.8 }]) },
  'hic-s-006': { label: 'mAb-A Sample 4', time: HIC_TIME, intensity: buildChromatogram([{ center: 4.2, height: 871, width: 0.6 }, { center: 7.6, height: 92, width: 0.5 }, { center: 11.9, height: 37, width: 0.7 }]) },
};

// -- Standard reference chromatogram --
export const HIC_STANDARD_CHROMATOGRAM: ChromatogramSeries = {
  label: 'HIC Standard Reference',
  time: HIC_TIME,
  intensity: buildChromatogram([{ center: 4.5, height: 900, width: 0.55 }, { center: 8.0, height: 80, width: 0.45 }, { center: 12.0, height: 30, width: 0.65 }]),
};

// ============================================================
// Search & Demo Data — Unsigned / Signed / Report Files
// ============================================================

export interface DemoFile {
  fileId: string;
  fileName: string;
  sourceSystem: string;
  versionId: string;
  sha256: string;
  assayType: string;
  uploadedAt: string;
  fileType?: 'document' | 'pdf';
  esignManifest?: { version: string; status: 'signed'; timestamp: string } | null;
  signedFileId?: string;
}

function fakeSha(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  const hex = Math.abs(h).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
}

const SRC_SYS = ['Empower CDS','MassLynx','Chromeleon','UNICORN','LabWare LIMS','NuGenesis','Agilent OpenLab','Thermo Fisher SII'];
const ASSAYS = ['Potency','Purity','Identity','Stability','Dissolution','Content Uniformity','Residual Solvents','Water Content','Particle Size','Sterility'];
const BPFX = ['LOT','BN','PROD','QC','REL'];

function buildUnsignedFiles(): DemoFile[] {
  const files: DemoFile[] = [];
  for (let i = 1; i <= 100; i++) {
    const idx = i - 1;
    const bn = 100 + Math.floor(idx / 4);
    const pfx = BPFX[idx % BPFX.length];
    const assay = ASSAYS[idx % ASSAYS.length];
    const src = SRC_SYS[idx % SRC_SYS.length];
    const day = 1 + (idx % 28);
    const mo = 1 + Math.floor(idx / 30) % 3;
    const pi = String(i).padStart(3, '0');
    files.push({
      fileId: `ufile-${pi}`,
      fileName: `${pfx}-${bn}-${assay.replace(/ /g, '-')}-${pi}.json`,
      sourceSystem: src,
      versionId: `v${1 + (idx % 4)}`,
      sha256: fakeSha(`ufile-${pi}`),
      assayType: assay,
      uploadedAt: `2026-0${mo}-${String(day).padStart(2, '0')}T${String(8 + (idx % 10)).padStart(2, '0')}:${String(idx % 60).padStart(2, '0')}:00Z`,
    });
  }
  return files;
}

export const UNSIGNED_FILES: DemoFile[] = buildUnsignedFiles();

export const SIGNED_FILES: DemoFile[] = [
  { fileId: 'sfile-001', fileName: 'LOT-200-Potency-Signed.json', sourceSystem: 'Empower CDS', versionId: 'v3', sha256: fakeSha('sfile-001'), assayType: 'Potency', uploadedAt: '2026-01-05T10:00:00Z', esignManifest: { version: 'v3', status: 'signed', timestamp: '2026-01-06T09:30:00Z' } },
  { fileId: 'sfile-002', fileName: 'BN-201-Purity-Signed.json', sourceSystem: 'MassLynx', versionId: 'v2', sha256: fakeSha('sfile-002'), assayType: 'Purity', uploadedAt: '2026-01-08T11:00:00Z', esignManifest: { version: 'v2', status: 'signed', timestamp: '2026-01-09T14:15:00Z' } },
  { fileId: 'sfile-003', fileName: 'PROD-202-Identity-Signed.json', sourceSystem: 'Chromeleon', versionId: 'v1', sha256: fakeSha('sfile-003'), assayType: 'Identity', uploadedAt: '2026-01-12T09:00:00Z', esignManifest: { version: 'v1', status: 'signed', timestamp: '2026-01-13T10:00:00Z' } },
  { fileId: 'sfile-004', fileName: 'QC-203-Stability-Signed.json', sourceSystem: 'UNICORN', versionId: 'v4', sha256: fakeSha('sfile-004'), assayType: 'Stability', uploadedAt: '2026-01-15T08:00:00Z', esignManifest: { version: 'v4', status: 'signed', timestamp: '2026-01-16T11:45:00Z' } },
  { fileId: 'sfile-005', fileName: 'REL-204-Dissolution-Signed.json', sourceSystem: 'LabWare LIMS', versionId: 'v2', sha256: fakeSha('sfile-005'), assayType: 'Dissolution', uploadedAt: '2026-01-20T14:00:00Z', esignManifest: { version: 'v2', status: 'signed', timestamp: '2026-01-21T16:30:00Z' } },
  { fileId: 'sfile-006', fileName: 'LOT-205-Content-Uniformity-Signed.json', sourceSystem: 'NuGenesis', versionId: 'v3', sha256: fakeSha('sfile-006'), assayType: 'Content Uniformity', uploadedAt: '2026-02-01T09:00:00Z', esignManifest: { version: 'v3', status: 'signed', timestamp: '2026-02-02T10:15:00Z' } },
  { fileId: 'sfile-007', fileName: 'BN-206-Residual-Solvents-Signed.json', sourceSystem: 'Agilent OpenLab', versionId: 'v1', sha256: fakeSha('sfile-007'), assayType: 'Residual Solvents', uploadedAt: '2026-02-05T10:00:00Z', esignManifest: { version: 'v1', status: 'signed', timestamp: '2026-02-06T08:00:00Z' } },
  { fileId: 'sfile-008', fileName: 'PROD-207-Water-Content-Signed.json', sourceSystem: 'Thermo Fisher SII', versionId: 'v2', sha256: fakeSha('sfile-008'), assayType: 'Water Content', uploadedAt: '2026-02-10T11:00:00Z', esignManifest: { version: 'v2', status: 'signed', timestamp: '2026-02-11T13:00:00Z' } },
  { fileId: 'sfile-009', fileName: 'QC-208-Particle-Size-Signed.json', sourceSystem: 'Empower CDS', versionId: 'v3', sha256: fakeSha('sfile-009'), assayType: 'Particle Size', uploadedAt: '2026-02-15T09:00:00Z', esignManifest: { version: 'v3', status: 'signed', timestamp: '2026-02-16T15:30:00Z' } },
  { fileId: 'sfile-010', fileName: 'REL-209-Sterility-Signed.json', sourceSystem: 'MassLynx', versionId: 'v1', sha256: fakeSha('sfile-010'), assayType: 'Sterility', uploadedAt: '2026-02-20T08:00:00Z', esignManifest: { version: 'v1', status: 'signed', timestamp: '2026-02-21T09:45:00Z' } },
];

export const ESIGN_REPORT_FILES: DemoFile[] = SIGNED_FILES.map((sf, i) => ({
  fileId: `rptfile-${String(i + 1).padStart(3, '0')}`,
  fileName: `eSignature-Report-${sf.fileName.replace('-Signed.json', '')}.pdf`,
  sourceSystem: 'eSignature App',
  versionId: 'v1',
  sha256: fakeSha(`rptfile-${String(i + 1).padStart(3, '0')}`),
  assayType: sf.assayType,
  uploadedAt: sf.esignManifest?.timestamp || sf.uploadedAt,
  fileType: 'pdf' as const,
  signedFileId: sf.fileId,
}));

export const runtimeSignedFiles: DemoFile[] = [];
export const runtimeReportFiles: DemoFile[] = [];

export function getAllUnsignedFiles(): DemoFile[] {
  const signedIds = new Set(
    [...SIGNED_FILES, ...runtimeSignedFiles].map(f => f.fileId),
  );
  return UNSIGNED_FILES.filter(f => !signedIds.has(f.fileId));
}
export function getAllSignedFiles(): DemoFile[] {
  return [...SIGNED_FILES, ...runtimeSignedFiles];
}
export function getAllReportFiles(): DemoFile[] {
  return [...ESIGN_REPORT_FILES, ...runtimeReportFiles];
}
export function findDemoFile(fileId: string): DemoFile | undefined {
  return [
    ...UNSIGNED_FILES, ...SIGNED_FILES, ...ESIGN_REPORT_FILES,
    ...runtimeSignedFiles, ...runtimeReportFiles,
  ].find(f => f.fileId === fileId);
}