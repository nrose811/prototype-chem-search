// ============================================================
// e-Signature Prototype — Signature Service (Mock)
// ============================================================

import {
  DEMO_USER,
  SignatureRecord,
  SignatureMeaning,
} from '../mocks/demoData';

export interface SignatureRequest {
  userId: string;
  /** Token returned by the AuthProvider after re-authentication. */
  authToken: string;
  /** Human-readable auth method label, e.g. "Username + Password" or "SSO – Okta (OIDC)". */
  authMethod: string;
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
 * Create a signed record after the caller has already authenticated
 * via an AuthProvider. The token is validated server-side in production;
 * here we just verify it is non-empty.
 */
export async function submitSignature(
  request: SignatureRequest,
): Promise<SignatureResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!request.authToken) {
    return {
      ok: false,
      error: 'Missing authentication token. Please re-authenticate and try again.',
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
    authenticationMethod: request.authMethod,
    datasetVersion: request.datasetVersion,
    reportId: `rpt-${request.batchId}-${Date.now()}`,
    status: 'APPLIED',
    batchId: request.batchId,
  };

  return { ok: true, signature };
}

