/**
 * Entity: Resolution
 *
 * Scaffolding:
 *   mode: hybrid
 *
 * Purpose:
 *   Represents a reusable remediation or fix
 *   applied to operational incidents.
 */

export type ResolutionId = string;

export type ResolutionOutcome =
  | "successful"
  | "partial"
  | "failed"
  | "unknown";

export interface Resolution {

  resolutionId: ResolutionId;

  title: string;

  description: string;

  outcome: ResolutionOutcome;

  effectivenessScore?: number;

  createdAt: string;

  updatedAt: string;

  tags: string[];
}