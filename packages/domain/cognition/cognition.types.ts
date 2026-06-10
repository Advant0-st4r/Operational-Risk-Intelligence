// cognition.types.ts



/**
 * 
 * allowed_evidence:

  signal

  telemetry

  root_cause

  resolution

  validation

  operator_judgment

 */


// The exact Allowed evidence types for cognition. 
// Declarative shapes only without any evaluation logic at this stage

/**
 * Canonical identifiers for evidence types used in cognition.
 */
export type EvidenceType =
  | 'signal'
  | 'telemetry'
  | 'root_cause'
  | 'resolution'
  | 'validation'
  | 'operator_judgment';

/**
 * Base metadata present on all evidence records.
 */
export interface BaseEvidenceMeta {
  id: string;                // unique evidence id
  type: EvidenceType;
  submittedBy?: string;      // actor id (person/system)
  submittedAtISO?: string;   // ISO 8601 timestamp
  confidence?: 'low' | 'medium' | 'high';
  source?: 'automated' | 'manual' | 'third_party';
  note?: string;
}

/**
 * Specific evidence payload shapes.
 * These are intentionally minimal and advisory; teams may extend them per domain needs.
 */

export interface SignalEvidence {
  alertId?: string;
  summary?: string;
  rawPayload?: unknown; // preserve original event/payload
  relatedEvents?: string[]; // other evidence ids
}

export interface TelemetryEvidence {
  metricName?: string;
  windowStartISO?: string;
  windowEndISO?: string;
  values?: number[]; // sampled or aggregated values
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'p95' | 'p99';
  note?: string;
}

export interface RootCauseEvidence {
  hypothesisId?: string;
  description?: string;
  implicatedComponents?: string[]; // services, hosts, or subsystems
  confidenceRationale?: string;
  supportingEvidenceIds?: string[]; // references to other evidence records
}

export interface ResolutionEvidence {
  resolutionId?: string;
  description?: string;
  owner?: string;
  startISO?: string;
  endISO?: string | null;
  steps?: string[]; // high-level action items
  rollbackPlan?: string | null;
  note?: string;
}

export interface ValidationEvidence {
  validationId?: string;
  validatedBy?: string;
  validatedAtISO?: string;
  success?: boolean;
  metricsCompared?: { [metric: string]: { before?: number; after?: number } };
  note?: string;
}

export interface OperatorJudgmentEvidence {
  judgmentId?: string;
  operatorId?: string;
  decision?: 'accept' | 'reject' | 'defer' | 'escalate';
  rationale?: string;
  relatedEvidenceIds?: string[];
  note?: string;
}

/**
 * Discriminated union of admissible evidence items for cognition workflows.
 */
export type CognitionEvidence =
  | (BaseEvidenceMeta & { type: 'signal'; data: SignalEvidence })
  | (BaseEvidenceMeta & { type: 'telemetry'; data: TelemetryEvidence })
  | (BaseEvidenceMeta & { type: 'root_cause'; data: RootCauseEvidence })
  | (BaseEvidenceMeta & { type: 'resolution'; data: ResolutionEvidence })
  | (BaseEvidenceMeta & { type: 'validation'; data: ValidationEvidence })
  | (BaseEvidenceMeta & { type: 'operator_judgment'; data: OperatorJudgmentEvidence });

/**
 * Wrapper records used by engines and stores.
 * Contains the evidence and optional references to incident/context.
 */
export interface CognitionEvidenceRecord {
  id: string;
  incidentId?: string;
  evidence: CognitionEvidence;
  tags?: string[]; // free-form tags for search/filters
  metadata?: { [key: string]: unknown }; // extensible bag
}