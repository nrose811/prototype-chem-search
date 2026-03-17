// ============================================================
// e-Signature Prototype — Integrity Service (Mock)
// ============================================================

import { DEMO_BATCH } from '../mocks/demoData';
import { getReport } from './reportService';

export interface IntegrityCheckResult {
  status: 'PASS' | 'FAIL';
  checkedAt: string;
  checks: IntegrityCheck[];
}

export interface IntegrityCheck {
  name: string;
  status: 'PASS' | 'FAIL';
  detail: string;
}

/**
 * Run a mock integrity verification against the signed data.
 * Always returns PASS when a valid signature exists.
 */
export async function verifyIntegrity(fileId: string): Promise<IntegrityCheckResult> {
  // Simulate verification delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const report = getReport();
  const file = DEMO_BATCH.files.find((f) => f.fileId === fileId);

  if (!file) {
    return {
      status: 'FAIL',
      checkedAt: new Date().toISOString(),
      checks: [
        {
          name: 'Signature Verification',
          status: 'FAIL',
          detail: 'No signature record found for this file.',
        },
      ],
    };
  }

  return {
    status: 'PASS',
    checkedAt: new Date().toISOString(),
    checks: [
      {
        name: 'SHA-256 Hash Match',
        status: 'PASS',
        detail: `File hash ${file.sha256.substring(0, 16)}... matches stored value.`,
      },
      {
        name: 'Signature Verification',
        status: 'PASS',
        detail: `Valid signature by ${report.signature.signerName} (${report.signature.signatureId}).`,
      },
      {
        name: 'Dataset Version Match',
        status: 'PASS',
        detail: `File version ${file.versionId} matches signed dataset ${report.signature.datasetVersion}.`,
      },
      {
        name: 'Timestamp Validation',
        status: 'PASS',
        detail: `Signature timestamp ${new Date(report.signature.timestamp).toLocaleString()} is within valid range.`,
      },
    ],
  };
}

