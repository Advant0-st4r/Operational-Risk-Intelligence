// First stable node in the graph.

// Without it, we have disconnected records with no correlation or causation information.

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