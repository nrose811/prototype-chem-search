// ============================================================
// e-Signature Prototype — Report Service (Mock)
// ============================================================
//
// Stores signature + batch snapshot so the SignedReportPage can
// render the report even after a page navigation / refresh.
// Session-scoped (in-memory).
// ============================================================

import { SignatureRecord, BatchReview, DEMO_BATCH, DEMO_USER } from '../mocks/demoData';

export interface SignedReport {
  reportId: string;
  generatedAt: string;
  signature: SignatureRecord;
  batchSnapshot: BatchReview;
}

let storedReport: SignedReport | null = null;

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

