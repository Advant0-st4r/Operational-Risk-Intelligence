// packages/application/case/operational-case.ts


/**
 * 
 * 
 Purpose:
 * Aggregates:

  - incident

  - severity

  - cognition

  - priority

  - root_cause

  - resolution

  - learning

Think:

Domain:
  individual truths

OperationalCase:
  user-facing, derived truth from combined domains

(applicable to incidents)
 */

// packages/application/case/operational-case.ts
// how_domain_objects_are_assembled to be aggregated
import type { Incident } from '../../domain/incident';
import type { IncidentSeverity } from '../../domain/incidents/incident.severity';

export interface OperationalCase {
  id: string;

  incident: Incident;

  severity?: IncidentSeverity;

  cognition?: unknown;

  priority?: unknown;

  rootCause?: unknown;

  resolution?: unknown;

  learning?: unknown;

  timeline: readonly OperationalCaseEvent[];
}

export interface OperationalCaseEvent {
  timestamp: Date;

  type: OperationalCaseEventType;

  payload: unknown;
}

export type OperationalCaseEventType =
  | 'case_created'
  | 'severity_assigned'
  | 'cognition_advanced'
  | 'root_cause_identified'
  | 'resolution_selected'
  | 'resolution_validated'
  | 'learning_captured';