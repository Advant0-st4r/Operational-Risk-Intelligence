/** Purpose:
 * 
 * 
 * why_did_this_move:

  observed
    ->
  understood

evidence:

  ...
*/



// Declarative structures for explaining cognition transitions and judgments.
// No enforcement logic-- shaped solely by artifacts for auditability and explainability.

/**
 * Minimal identifiers and timestamps.
 */
export interface AuditMeta {
  id: string;                 // unique audit record id
  incidentId?: string;
  createdBy?: string;         // actor who recorded the explanation
  createdAtISO: string;       // ISO 8601 timestamp
  note?: string;
}

/**
 * Explanation of why a cognition state transition occurred.
 */
export interface CognitionTransitionExplanation extends AuditMeta {
  from: string;               // previous cognition state (like 'OBSERVED')
  to: string;                 // simple new cognition state indicator (like 'UNDERSTOOD')
  triggerEvidenceIds: string[]; // evidence record ids that triggered or supported the transition
  rationale: string;          // human-readable rationale summarizing the judgment
  automated?: boolean;        // whether transition was automated
  approver?: string | null;   // if approval required, who approved
  confidence?: 'low' | 'medium' | 'high';
}

/**
 * Evidence-level explanation entries (what evidence supported which facet of cognition).
 */
export interface EvidenceExplanation extends AuditMeta {
  evidenceId: string;
  evidenceType: string;
  summary: string;            // short human-readable summary of the evidence
  contribution: 'supports' | 'contradicts' | 'neutral';
  confidence?: 'low' | 'medium' | 'high';
  details?: { [key: string]: unknown }; // extensible payload for deeper provenance
}

/**
 * Full cognition audit record tying together transition explanation and per-evidence explanations.
 */
export interface CognitionAuditRecord {
  auditId: string;
  incidentId?: string;
  transition?: CognitionTransitionExplanation | null;
  evidenceExplanations?: EvidenceExplanation[]; // ordered list of contributions considered
  previousCognitionState?: string | null;
  resultingCognitionState?: string | null;
  notes?: string;
}

/**
 * Small pure helpers (declarative only) to construct canonical audit records.
 * These do not persist or validate; they help callers create well-formed objects.
 */

export function makeTransitionExplanation(params: {
  id: string;
  incidentId?: string;
  from: string;
  to: string;
  triggerEvidenceIds: string[];
  rationale: string;
  createdBy?: string;
  createdAtISO: string;
  automated?: boolean;
  approver?: string | null;
  confidence?: 'low' | 'medium' | 'high';
  note?: string;
}): CognitionTransitionExplanation {
  return {
    id: params.id,
    incidentId: params.incidentId,
    from: params.from,
    to: params.to,
    triggerEvidenceIds: params.triggerEvidenceIds,
    rationale: params.rationale,
    createdBy: params.createdBy,
    createdAtISO: params.createdAtISO,
    automated: params.automated ?? false,
    approver: params.approver ?? null,
    confidence: params.confidence ?? 'medium',
    note: params.note,
  };
}

export function makeEvidenceExplanation(params: {
  id: string;
  incidentId?: string;
  evidenceId: string;
  evidenceType: string;
  summary: string;
  contribution: 'supports' | 'contradicts' | 'neutral';
  createdBy?: string;
  createdAtISO: string;
  confidence?: 'low' | 'medium' | 'high';
  details?: { [key: string]: unknown };
  note?: string;
}): EvidenceExplanation {
  return {
    id: params.id,
    incidentId: params.incidentId,
    evidenceId: params.evidenceId,
    evidenceType: params.evidenceType,
    summary: params.summary,
    contribution: params.contribution,
    createdBy: params.createdBy,
    createdAtISO: params.createdAtISO,
    confidence: params.confidence ?? 'medium',
    details: params.details,
    note: params.note,
  };
}

export function makeCognitionAuditRecord(params: {
  auditId: string;
  incidentId?: string;
  transition?: CognitionTransitionExplanation | null;
  evidenceExplanations?: EvidenceExplanation[];
  previousCognitionState?: string | null;
  resultingCognitionState?: string | null;
  notes?: string;
}): CognitionAuditRecord {
  return {
    auditId: params.auditId,
    incidentId: params.incidentId,
    transition: params.transition ?? null,
    evidenceExplanations: params.evidenceExplanations ?? [],
    previousCognitionState: params.previousCognitionState ?? null,
    resultingCognitionState: params.resultingCognitionState ?? null,
    notes: params.notes,
  };
}