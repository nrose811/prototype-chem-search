// ============================================================
// e-Signature Prototype — Signature Service (Mock)
// ============================================================

import {
  DEMO_USER,
  DEMO_PASSWORD,
  SignatureRecord,
  SignatureMeaning,
} from '../mocks/demoData';

export interface SignatureRequest {
  userId: string;
  password: string;
  meaning: SignatureMeaning;
  batchId: string;
  datasetVersion: string;
}

export interface SignatureSuccess {
  ok: true;
  signature: SignatureRecord;
}

export interface SignatureFailure {
  ok: false;
  error: string;
}

export type SignatureResult = SignatureSuccess | SignatureFailure;

/**
 * Simulate a signature submission with a short delay.
 * Valid credentials: DEMO_USER.userId + DEMO_PASSWORD
 */
export async function submitSignature(
  request: SignatureRequest,
): Promise<SignatureResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Validate credentials
  if (request.userId !== DEMO_USER.userId || request.password !== DEMO_PASSWORD) {
    return {
      ok: false,
      error: 'Authentication failed. Please verify your credentials and try again.',
    };
  }

  // Generate signature record
  const now = new Date();
  const signature: SignatureRecord = {
    signatureId: `sig-${Date.now()}`,
    signerId: DEMO_USER.userId,
    signerName: DEMO_USER.name,
    timestamp: now.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    meaning: request.meaning,
    authenticationMethod: 'Username + Password',
    datasetVersion: request.datasetVersion,
    reportId: `rpt-${request.batchId}-${Date.now()}`,
    status: 'APPLIED',
    batchId: request.batchId,
  };

  return { ok: true, signature };
}

