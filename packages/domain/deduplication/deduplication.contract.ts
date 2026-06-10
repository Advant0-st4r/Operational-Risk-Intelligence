// deduplication.contract.ts = what a duplicate means



import type { IncidentId, ServiceId } from "../types/ids";

/**
 * DEDUPLICATION CONTRACT
 *
 * Ownership Boundary:
 * Defines what it means for two incidents to represent
 * the same underlying operational event.
 *
 * Invariants:
 * - Deduplication is binary.
 * - Deduplication decisions are reversible.
 * - Cross-service deduplication is permitted.
 * - False positives are considered more expensive than false negatives.
 * - Matching symptoms alone do not imply duplication.
 * - Matching impact alone does not imply duplication.
 * - Incidents with different root causes must not be considered duplicates.
 *
 * Non-Goals:
 * - Does not define scoring.
 * - Does not define weighting.
 * - Does not define fingerprinting.
 * - Does not define matching algorithms.
 */
export interface DeduplicationDecision {
  readonly sourceIncidentId: IncidentId;
  readonly candidateIncidentId: IncidentId;

  readonly isDuplicate: boolean;

  /**
   * Human-readable justification.
   *
   * Example:
   * "Shared operational event and root cause."
   */


  readonly rationale: string;
}

/**
 * Immutable comparison context.
 *
 * Implementations may use additional signals,
 * but these fields represent the minimum contract
 * required to evaluate duplicate status.
 */
export interface DeduplicationContext {
  readonly incidentId: IncidentId;

  readonly serviceId: ServiceId;

  /**
   * Canonical root cause identifier.
   *
   * Different root causes imply
   * different incidents.
   */
  readonly rootCauseId?: string;

  /**
   * Event occurrence timestamp.
   *
   * Time may be considered,
   * but must not dominate identity.
   */
  readonly occurredAt: Date;
}