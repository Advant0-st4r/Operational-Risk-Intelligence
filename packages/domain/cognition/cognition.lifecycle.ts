/**
 * Purpose:
 * 
 * observed:
  can_transition_to:
    - understood

understood:
  can_transition_to:
    - acted_upon

acted_upon:
  can_transition_to:
    - validated

validated:
  can_transition_to:
    - archived
 */





// Declarative cognition transition policy: which cognition states may move to which others.
// No enforcement, no timing logic-- policy only.

import type { CognitionState } from './cognition.contract';

export interface CognitionTransition {
  from: CognitionState | 'ANY';
  to: CognitionState;
  allowed: boolean;
  requiresApproval?: boolean;
  reason?: string;
  preservingFields?: string[]; // fields to carry forward (e.g., evidence IDs, timestamps)
}

export interface CognitionLifecyclePolicy {
  steward: string;
  preserveHistory: boolean;
  allowedTransitions: CognitionTransition[];
  note?: string;
}

/**
 * Canonical cognition lifecycle policy (declarative).
 * Default-deny for unspecified transitions.
 */
export const DefaultCognitionLifecycle: CognitionLifecyclePolicy = {
  steward: 'incident-management',
  preserveHistory: true,
  note: 'Cognition state transitions are declarative policy statements; enforcement lives elsewhere.',
  allowedTransitions: [
    {
      from: 'OBSERVED',
      to: 'UNDERSTOOD',
      allowed: true,
      requiresApproval: false,
      reason: 'Observation may progress to understanding when sufficient root-cause evidence is recorded.',
      preservingFields: ['evidenceIds', 'signalIds'],
    },
    {
      from: 'UNDERSTOOD',
      to: 'ACTED_UPON',
      allowed: true,
      requiresApproval: false,
      reason: 'Teams may select and begin executing a resolution once a root cause is established.',
      preservingFields: ['rootCauseId', 'hypothesis'],
    },
    {
      from: 'ACTED_UPON',
      to: 'VALIDATED',
      allowed: true,
      requiresApproval: false,
      reason: 'After remediation, evidence should confirm outcome before archiving.',
      preservingFields: ['resolutionId', 'validationRecords'],
    },
    {
      from: 'VALIDATED',
      to: 'ARCHIVED',
      allowed: true,
      requiresApproval: true,
      reason: 'Archiving may require steward sign-off depending on retention/compliance.',
      preservingFields: ['incidentId', 'severityHistory', 'cognitionHistory'],
    },
    {
      from: 'ANY',
      to: 'OBSERVED',
      allowed: true,
      requiresApproval: false,
      reason: 'Any record may be returned to observed if new signals arrive or prior understanding is invalidated.',
      preservingFields: ['evidenceIds'],
    },
  ],
};

/**
 * Helper lookup (pure): find explicit transition rule or ANY->to rule.
 *
 * Note: DEFINITELY AI-written. Human writing this needs to develop far deeper syntactic familiarity to play logic games like these
*/

export function findTransitionRule(
  policy: CognitionLifecyclePolicy,
  from: CognitionState,
  to: CognitionState
): CognitionTransition | null {
  const exact = policy.allowedTransitions.find((t) => t.from === from && t.to === to);
  if (exact) return exact;
  const anyMatch = policy.allowedTransitions.find((t) => t.from === 'ANY' && t.to === to);
  if (anyMatch) return anyMatch;
  return null;
}