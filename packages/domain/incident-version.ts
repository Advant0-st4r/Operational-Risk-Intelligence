// Purpose: Versioning our incidents so they can become operational memory

// Ownership:
//   Canonical operational disruption record.


import { IncidentId } from "./incident";

/**
 * Entity: IncidentVersion
 *
 * Scaffolding:
 *   mode: hybrid
 *
 * Purpose:
 *   Preserve historical truth.
 */

export type IncidentVersionId = string;

export interface IncidentVersion {

  versionId: IncidentVersionId;

  incidentId: IncidentId;

  versionNumber: number;

  createdAt: string;

  createdBy: string;

  changeReason: string;

  snapshot: Record<string, unknown>;

  previousVersionId?: IncidentVersionId;
}