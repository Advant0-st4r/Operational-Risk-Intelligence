/**
 * 
 * What This File Should Freeze

Not implementation.

Just the lifecycle vocabulary and legal transitions.

Something conceptually like:

states:

  observed

  understood

  acted_upon

  validated

  archived

and

transitions:

  observed:
    -> understood

  understood:
    -> acted_upon

  acted_upon:
    -> validated

  validated:
    -> archived

and most importantly:

entry_requirements:

  understood:
    root_cause_identified

  acted_upon:
    remediation_selected

  validated:
    expected_outcome_confirmed

  archived:
    no_remaining_actionable_value

 * 
 * classification:
  MUST_BUILD_MANUALLY
 */


/** 
Can an incident move from

understood
    ->
acted_upon

without a chosen resolution/remediation?

 NO
*/


import type { IncidentId } from "../types/ids";

/**
 * Operational cognition lifecycle.
 */

export const enum IncidentLifecycleState {
  Observed = "observed",

  Understood = "understood",

  ActedUpon = "acted_upon",

  Validated = "validated",

  Archived = "archived"
};

export interface IncidentLifecycleTransition {
  readonly incidentId: IncidentId;

  readonly from: IncidentLifecycleState;

  readonly to: IncidentLifecycleState;

  readonly occurredAt: Date;

  readonly rationale: string;
};



/**
 * Allowed state transitions
 */

export const AllowedTransitions: Readonly<
  Record<IncidentLifecycleState, readonly IncidentLifecycleState[]>
> = {
  [IncidentLifecycleState.Observed]: [
    IncidentLifecycleState.Understood
  ],

  [IncidentLifecycleState.Understood]: [
    IncidentLifecycleState.ActedUpon
  ],

  [IncidentLifecycleState.ActedUpon]: [
    IncidentLifecycleState.Validated
  ],

  [IncidentLifecycleState.Validated]: [
    IncidentLifecycleState.Archived
  ],

  [IncidentLifecycleState.Archived]: []
} as const;


// lifecycle requirement: understood, actedUpon, validated, archived

export const LifecycleRequirements: readonly LifecycleRequirement[] = [
  {
    state: IncidentLifecycleState.Understood, 
    requirement: "",
  }, 
  {
    state: IncidentLifecycleState.Understood, 
    requirement: "root_cause_identified"}, 
  {
    state: IncidentLifecycleState.ActedUpon
    , 
    requirement: "remediation_selected",
  }, 
  {
    state: IncidentLifecycleState.Validated
    , 
    requirement: "expected_outcome_confirmed",
  },
  {
    state: IncidentLifecycleState.Archived
    , 
    requirement: "no_remaining_actionable_value",
  },
]

