
// deduplication.types.ts = what information is allowed to participate in determining that



/** 
evidence_categories:

  operational:
    ?

  causal:
    ?

  impact:
    ?

  temporal:
    ?

  service:
    ?

  metadata:
    ?


decision_outcomes:

  duplicate

  not_duplicate

  insufficient_evidence
*/




/**
 * Can a duplicate determination be made
without a known root cause?

NO
*/

export const enum DeduplicationEvidenceCategory {
  Operational = "operational",
  Causal = "causal",
  Impact = "impact",
  Temporal = "temporal",
  Service = "service",
  Metadata = "metadata"
}

export const enum DeduplicationOutcome {
  Duplicate = "duplicate",
  NotDuplicate = "not_duplicate",
  InsufficientEvidence = "insufficient_evidence"
}


export type ISO8601 = string; // e.g. "2024-01-01T00:00:00Z"
export type UUID = string; // e.g. "123e4567-e89b-12d3-a456-426614174000"
export type Confidence = string // e.g. "high", "medium", "low"
export type Details = Record<string, unknown>;

/**
 * Single piece of evidence contributed to deduplication.
 * Keep lightweight, immutable, and provenance-bearing.
 */

export interface DeduplicationEvidenceItem {
  id: UUID;
  category: DeduplicationEvidenceCategory;
  timestamp: ISO8601;
  confidence: Confidence;
  details: Details;
  source: string; // e.g. "automated_monitoring", "human_report", "post_incident_analysis"
}




/**
 * Aggregated evidence bag (bundled evidences per incident) describing a single observed event/alert.
 */

export interface DeduplicationEvidenceBag {
  incidentId: UUID;
  items: DeduplicationEvidenceItem[],
  createdAt: ISO8601; // when the event actually occured
  ingestedAt: ISO8601;// when the sys logged or received the instance of the event
  source: string; // e.g. "automated_monitoring", "human_report", "post_incident_analysis"
}









/**
  Final decision structure returned by deduplication engine.
 */

export interface DeduplicationDecision {
  outcome: DeduplicationOutcome;
  score: Confidence;
  thresholdUsed: {
      duplicate: number;
      notDuplicate: number;
      insufficientEvidence: number;
    };
    rationale: string[]; // human-readable justification for the decision
    timestamp: ISO8601; 
  };

