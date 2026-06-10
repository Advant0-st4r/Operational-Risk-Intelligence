// Declarative shapes for evidence and artifacts used when assigning priority.

/**
 * Priority evidence types .
 */
export type PriorityEvidenceType =
  | 'severity'            // canonical severity (SEV1..SEV5)
  | 'cognition_state'     // OBSERVED|UNDERSTOOD|ACTED_UPON|VALIDATED|ARCHIVED
  | 'customer_impact'     // customer-facing impact details
  | 'business_metrics'    // revenue, churn risk, etc.
  | 'operational_capacity'// responder availability, blackout windows
  | 'manual_override';    // human-declared priority override and rationale

/**
 * Base metadata for priority evidence items.
 */
export interface PriorityEvidenceMeta {
  id: string;
  type: PriorityEvidenceType;
  providedBy?: string;     // actor id (team/user/system)
  providedAtISO?: string;  // ISO 8601 timestamp
  confidence?: 'low' | 'medium' | 'high';
  note?: string;
}

/**
 * Specific payload shapes.
 * Kept intentionally minimal; consumers may extend for domain specifics.
 */

export interface SeverityPayload {
  severity?: 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4' | 'SEV5';
  supportingEvidenceIds?: string[]; // references into severity/cognition evidence
}

export interface CognitionStatePayload {
  cognitionState?: 'OBSERVED' | 'UNDERSTOOD' | 'ACTED_UPON' | 'VALIDATED' | 'ARCHIVED';
  supportingEvidenceIds?: string[];
}

export interface CustomerImpactPayload {
  affectedCustomersEstimate?: number;
  affectedSegments?: string[];
  customerFacing?: boolean;
  escalations?: number;
  note?: string;
}

export interface BusinessMetricsPayload {
  estimatedRevenueLossUSD?: number;
  slaBreachCount?: number;
  priorityDrivers?: string[]; // free-form tags
  note?: string;
}

export interface OperationalCapacityPayload {
  onCallLoadPercent?: number; // 0-100
  blackoutWindow?: { startISO: string; endISO: string } | null;
  availableResponders?: number;
  note?: string;
}

export interface ManualOverridePayload {
  level?: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  reason?: string;
  overriddenBy?: string;
  overriddenAtISO?: string;
}

/**
 * Discriminated union of admissible priority evidence records.
 */
export type PriorityEvidence =
  | (PriorityEvidenceMeta & { type: 'severity'; data: SeverityPayload })
  | (PriorityEvidenceMeta & { type: 'cognition_state'; data: CognitionStatePayload })
  | (PriorityEvidenceMeta & { type: 'customer_impact'; data: CustomerImpactPayload })
  | (PriorityEvidenceMeta & { type: 'business_metrics'; data: BusinessMetricsPayload })
  | (PriorityEvidenceMeta & { type: 'operational_capacity'; data: OperationalCapacityPayload })
  | (PriorityEvidenceMeta & { type: 'manual_override'; data: ManualOverridePayload });

/**
 * Wrapper record for stores and engines.
 */
export interface PriorityEvidenceRecord {
  id: string;
  incidentId?: string;
  evidence: PriorityEvidence;
  tags?: string[];
  metadata?: { [key: string]: unknown };
}