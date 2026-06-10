/**
 * Canonical Domain Enums
 * 
 * Defining IncidentSeverity, 
 * IncidentStatus, 
 * ServiceTier, 
 * ResolutionOutcome 
 * as string literal types to ensure type safety and consistency across the codebase.
 *
 * Scaffolding:
 *   mode: manual
 */

export type IncidentSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type IncidentStatus =
  | "open"
  | "investigating"
  | "mitigated"
  | "resolved"
  | "closed";

export type ServiceTier =
  | "tier_0"
  | "tier_1"
  | "tier_2"
  | "tier_3";

export type ResolutionOutcome =
  | "successful"
  | "partial"
  | "failed"
  | "unknown";