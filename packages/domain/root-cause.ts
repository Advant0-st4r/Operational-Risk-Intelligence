/**
 * Entity: RootCause
 *
 * Scaffolding:
 *   mode: hybrid
 */

export type RootCauseId = string;

export interface RootCause {

  rootCauseId: RootCauseId;

  name: string;

  category: string;

  description: string;

  createdAt: string;
}