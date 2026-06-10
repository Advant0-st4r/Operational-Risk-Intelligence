/**
 * Entity: Team
 *
 * Scaffolding:
 *   mode: hybrid
 *
 * Purpose:
 *   Operational ownership unit.
 */

export type TeamId = string;

export interface Team {

  teamId: TeamId;

  name: string;

  description: string;

  active: boolean;

  createdAt: string;

  updatedAt: string;
}