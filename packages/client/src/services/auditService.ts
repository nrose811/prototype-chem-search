// ============================================================
// e-Signature Prototype — Audit Service (Mock)
// ============================================================

import { AuditEvent, SEED_AUDIT_EVENTS, SignatureRecord, DEMO_USER } from '../mocks/demoData';

// In-memory audit log (session-scoped)
let auditLog: AuditEvent[] = [...SEED_AUDIT_EVENTS];

/**
 * Get all audit events, newest first.
 */
export function getAuditEvents(): AuditEvent[] {
  return [...auditLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

/**
 * Add a custom audit event.
 */
export function addAuditEvent(event: AuditEvent): void {
  auditLog.push(event);
}

/** Optional context to customize audit event origin / entity for different apps. */
export interface AuditContext {
  origin?: string;
  entityName?: string;
  datasetVersion?: string;
}

const DEFAULT_CONTEXT: Required<AuditContext> = {
  origin: 'CRO Data Review App v1.4.0',
  entityName: 'CRO Alpha -- Batch 42',
  datasetVersion: '',
};

/**
 * Record a successful signature event.
 */
export function recordSignatureApplied(
  signature: SignatureRecord,
  ctx?: AuditContext,
): AuditEvent {
  const { origin, entityName } = { ...DEFAULT_CONTEXT, ...ctx };
  const event: AuditEvent = {
    eventId: `evt-${Date.now()}`,
    eventType: 'E-Signature Applied',
    userId: signature.signerId,
    userName: signature.signerName,
    userRole: DEMO_USER.role,
    userIp: '47.220.172.63',
    timestamp: signature.timestamp,
    result: 'SUCCESS',
    datasetVersion: signature.datasetVersion,
    reason: `Signed with meaning: "${signature.meaning}"`,
    origin,
    entityName,
    entityType: 'Signature',
    entityId: signature.signatureId,
    details: {
      signatureId: signature.signatureId,
      meaning: signature.meaning,
      authMethod: signature.authenticationMethod,
      reportId: signature.reportId,
      batchId: signature.batchId,
    },
  };
  auditLog.push(event);
  return event;
}

/**
 * Record a failed signature attempt.
 */
export function recordSignatureFailed(
  batchId: string,
  datasetVersion: string,
  reason: string,
  ctx?: AuditContext,
): AuditEvent {
  const { origin, entityName } = { ...DEFAULT_CONTEXT, ...ctx };
  const event: AuditEvent = {
    eventId: `evt-${Date.now()}`,
    eventType: 'E-Signature Failed',
    userId: DEMO_USER.userId,
    userName: DEMO_USER.name,
    userRole: DEMO_USER.role,
    userIp: '47.220.172.63',
    timestamp: new Date().toISOString(),
    result: 'FAILURE',
    datasetVersion,
    reason,
    origin,
    entityName,
    entityType: 'Signature',
    entityId: batchId,
    details: {
      batchId,
      attemptedBy: DEMO_USER.email,
    },
  };
  auditLog.push(event);
  return event;
}

/**
 * Reset audit log to seed state (for demo reset).
 */
export function resetAuditLog(): void {
  auditLog = [...SEED_AUDIT_EVENTS];
}

