// cognition.contract.ts



/**
 * 
 * Functionally, context:
 * severity.lifecycle.ts:

  governs:
    severity_changes

  examples:
    SEV4 -> SEV3
    SEV2 -> SEV1

But platform's core lifecycle is:

observed
understood
acted_upon
validated
archived

So the remaining scaffold isn't:

How does severity change?

It's:

What evidence permits cognition to advance?

 */



/**status:
 * 
 * ontology:

  incident
  root_cause
  resolution
  service
  team

judgment:

  deduplication

severity:

  contract
  lifecycle

cognition:

  lifecycle
 */





// Cognition constitution: declarative ownership of what is required for cognition states to advance.
// No algorithms, no thresholds— only policy-shaped requirements and steward metadata.

/**
 * Owner identifier (team, role, or system id).
 * Concrete owner resolution is a different component elsewhere.
 */
export type OwnerId = string;

/**
 * Canonical/core cognition states (core vocabulary).
 * These must align with platform-level workflow stages.
 */
export type CognitionState =
  | 'OBSERVED'     // signal detected, and/or raw inputs collected
  | 'UNDERSTOOD'   // root cause(s) identified; hypothesis formed
  | 'ACTED_UPON'   // resolution chosen and remediation begun
  | 'VALIDATED'    // outcome confirmed; hypothesis and actions validated
  | 'ARCHIVED';    // no remaining actionable value; record kept for history/compliance

export interface StateRequirement {
  /**
   * short name of the requirement (such as, "signal", "root_cause")
   */
  name: string;
  /**
   * human-readable description of what evidence/artefact must exist
   * for the state transition to be considered valid.
   */
  description: string;
  /**
   * who actually owns producing/confirming this requirement (team or role id)
   */
  owner: OwnerId;
  /**
   * whether this requirement is mandatory (true) or optional/helpful (false)
   */
  mandatory: boolean;
  /**
   * any policy notes, e.g., "must reference evidence record IDs" or "requires timestamp"
   */
  notes?: string;
}

/**
 * Constitutional rules for each cognition state.
 * These declare the minimal evidence required to assert that the incident has reached a given cognition state.
 * No enforcement or validation logic is included here.
 */
export interface CognitionConstitution {
  steward: OwnerId; // who owns the cognition contract (policy decisions)
  preserveHistory: boolean; // whether cognition state changes must be recorded in immutable history
  states: {
    OBSERVED: {
      requires: StateRequirement[];
    };
    UNDERSTOOD: {
      requires: StateRequirement[];
    };
    ACTED_UPON: {
      requires: StateRequirement[];
    };
    VALIDATED: {
      requires: StateRequirement[];
    };
    ARCHIVED: {
      requires: StateRequirement[];
    };
  };
}

/**
 * Canonical requirements according to the supplied specification.
 * These are declarative artifacts only; they do not perform checks.
 */
export const CognitionContract: CognitionConstitution = {
  steward: 'incident-management',
  preserveHistory: true,
  states: {
    OBSERVED: {
      requires: [
        {
          name: 'signal',
          description: 'An originating signal or alert that initiated observation (e.g., alert id, error event).',
          owner: 'monitoring',
          mandatory: true,
          notes: 'Should reference one or more evidence record IDs and timestamp.',
        },
      ],
    },
    UNDERSTOOD: {
      requires: [
        {
          name: 'root_cause',
          description: 'A documented root cause hypothesis (may be provisional) linking signal to underlying issue.',
          owner: 'oncall' ,
          mandatory: true,
          notes: 'Should include rationale and evidence references; may be iterative.',
        },
      ],
    },
    ACTED_UPON: {
      requires: [
        {
          name: 'chosen_resolution',
          description: 'A selected remediation/mitigation action with an owner and plan.',
          owner: 'oncall' ,
          mandatory: true,
          notes: 'Must include responsible party, ETA, and rollback plan if applicable.',
        },
      ],
    },
    VALIDATED: {
      requires: [
        {
          name: 'outcome_confirmation',
          description: 'Evidence that the chosen resolution produced the intended outcome (metrics, tests, or stakeholder confirmation).',
          owner: 'oncall',
          mandatory: true,
          notes: 'Prefer automated checks where possible; include timestamps and verifier identity.',
        },
      ],
    },
    ARCHIVED: {
      requires: [
        {
          name: 'no_remaining_actionable_value',
          description: 'A policy assertion that no further work is required and the record may be archived (could include retention metadata).',
          owner: 'incident-management',
          mandatory: true,
          notes: 'Should reference validation artifacts and any post-incident actions or follow-ups recorded elsewhere.',
        },
      ],
    },
  },
};

/**
 * condense into Helpful helpers (declarative only) — small, pure utilities for consumers to read the contract.
 * These do not perform policy enforcement.
 */

export function getRequirementsFor(state: CognitionState): StateRequirement[] {
  return CognitionContract.states[state].requires;
}

export function isRequirementMandatory(state: CognitionState, requirementName: string): boolean {
  const req = CognitionContract.states[state].requires.find((r) => r.name === requirementName);
  return Boolean(req && req.mandatory);
}