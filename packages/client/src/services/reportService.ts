// ============================================================
// e-Signature Prototype — Report Service (Mock)
// ============================================================
//
// Stores signature + batch snapshot so the SignedReportPage can
// render the report even after a page navigation / refresh.
// Session-scoped (in-memory).
// ============================================================

import { SignatureRecord, BatchReview, DEMO_BATCH, DEMO_USER, HicSampleSet } from '../mocks/demoData';

export interface SignedReport {
  reportId: string;
  generatedAt: string;
  signature: SignatureRecord;
  batchSnapshot: BatchReview;
}

let storedReport: SignedReport | null = null;

// ---- Report file registry (mock file system) ----
export interface ReportFile {
  fileId: string;
  fileName: string;
  reportId: string;
  generatedAt: string;
  fileType: 'pdf';
  sourceLocation: string;
  routePath: string;
}

const reportFiles: ReportFile[] = [
  {
    fileId: 'rpt-file-001',
    fileName: 'CRO-Data-Review-Signed-Report-Batch42.pdf',
    reportId: 'rpt-batch-042-1710700800000',
    generatedAt: '2026-03-15T14:30:05.000Z',
    fileType: 'pdf',
    sourceLocation: '/tetrasphere/reports/signed',
    routePath: '/apps/cro-data-review/report/rpt-batch-042-1710700800000',
  },
];

export function getReportFiles(): ReportFile[] {
  return [...reportFiles];
}

export function getReportFile(fileId: string): ReportFile | undefined {
  return reportFiles.find((f) => f.fileId === fileId);
}

function registerReportFile(report: SignedReport): void {
  if (reportFiles.find((f) => f.reportId === report.reportId)) return;
  reportFiles.push({
    fileId: `rpt-file-${Date.now()}`,
    fileName: `CRO-Data-Review-Signed-Report-${report.batchSnapshot.batchId}.pdf`,
    reportId: report.reportId,
    generatedAt: report.generatedAt,
    fileType: 'pdf',
    sourceLocation: '/tetrasphere/reports/signed',
    routePath: `/apps/cro-data-review/report/${report.reportId}`,
  });
}

// Default demo report for pre-signed demo files (file-001 through file-004)
const DEFAULT_DEMO_REPORT: SignedReport = {
  reportId: 'rpt-batch-042-1710700800000',
  generatedAt: '2026-03-15T14:30:05.000Z',
  signature: {
    signatureId: 'sig-demo-batch042-1710700800000',
    signerId: DEMO_USER.userId,
    signerName: DEMO_USER.name,
    timestamp: '2026-03-15T14:30:00.000Z',
    timezone: 'America/New_York',
    meaning: 'Review and Approval',
    authenticationMethod: 'Username + Password',
    datasetVersion: 'v2.1.0',
    reportId: 'rpt-batch-042-1710700800000',
    status: 'APPLIED',
    batchId: 'batch-042',
  },
  batchSnapshot: { ...DEMO_BATCH, status: 'SIGNED' },
};

/**
 * Create and store a signed report after a successful signature.
 */
export function createReport(
  signature: SignatureRecord,
  batch: BatchReview,
): SignedReport {
  const report: SignedReport = {
    reportId: signature.reportId,
    generatedAt: new Date().toISOString(),
    signature,
    batchSnapshot: { ...batch, status: 'SIGNED' },
  };
  storedReport = report;
  registerReportFile(report);
  return report;
}

/**
 * Retrieve the stored report, falling back to the default demo report.
 */
export function getReport(): SignedReport {
  return storedReport || DEFAULT_DEMO_REPORT;
}

/**
 * Clear stored report (for demo reset).
 */
export function resetReport(): void {
  storedReport = null;
}

// ============================================================
// HIC QC Report
// ============================================================

export interface HicQcSignedReport {
  reportId: string;
  generatedAt: string;
  signature: SignatureRecord;
  sampleSets: HicSampleSet[];
  comments: string;
  totalSamples: number;
  passCount: number;
  failCount: number;
}

let storedHicReport: HicQcSignedReport | null = null;

/**
 * Create and store a signed HIC QC report.
 */
export function createHicQcReport(
  signature: SignatureRecord,
  sampleSets: HicSampleSet[],
  comments: string,
): HicQcSignedReport {
  const totalSamples = sampleSets.reduce((n, ss) => n + ss.samples.length, 0);
  const passCount = sampleSets.flatMap((ss) => ss.samples).filter((s) => s.qc_status === 'Pass').length;
  const report: HicQcSignedReport = {
    reportId: signature.reportId,
    generatedAt: new Date().toISOString(),
    signature,
    sampleSets,
    comments,
    totalSamples,
    passCount,
    failCount: totalSamples - passCount,
  };
  storedHicReport = report;
  return report;
}

/**
 * Retrieve the stored HIC QC report.
 */
export function getHicQcReport(): HicQcSignedReport | null {
  return storedHicReport;
}

/**
 * Clear stored HIC QC report (for demo reset).
 */
export function resetHicQcReport(): void {
  storedHicReport = null;
}
