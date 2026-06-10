/**
 * Entity: Incident
 *
 * Scaffolding:
 *   mode: hybrid
 *
 * Ownership:
 *   Canonical operational disruption record.
 * 
 * Purpose: Define what an incident is.
 */

export type IncidentId = string;
export type ServiceId = string;
export type TeamId = string;
export type RootCauseId = string;
export type ResolutionId = string;

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

export interface Incident {

  incidentId: IncidentId;

  title: string;

  summary: string;

  severity: IncidentSeverity;

  status: IncidentStatus;

  serviceIds: ServiceId[];

  teamIds: TeamId[];

  rootCauseIds: RootCauseId[];

  resolutionIds: ResolutionId[];

  startedAt: string;

  resolvedAt?: string;

  createdAt: string;

  updatedAt: string;

  currentVersion: number;

  canonical: boolean;

  mergedInto?: IncidentId;

  tags: string[];
}