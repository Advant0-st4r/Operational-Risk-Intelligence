// severity.lifecycle.ts
// Rules about how IncidentSeverity may change over time — ownership / policy declarations only.
// No algorithms, no automatic transitions for now-- only allowed transitions and retention policy.

export type SeverityState =
  | 'SEV1'
  | 'SEV2'
  | 'SEV3'
  | 'SEV4'
  | 'SEV5';

export interface TransitionRule {
  from: SeverityState | 'ANY';
  to: SeverityState;
  allowed: boolean;           // whether this transition is permitted by policy
  reason?: string;            // short rationale or policy note
  requiresApproval?: boolean; // if true, change must be approved by steward/authority
  preservingFields?: string[]; // which incident fields must be preserved/copied into new record
}

export interface LifecyclePolicy {
  allowedTransitions: TransitionRule[];
  steward: string;            // who owns lifecycle policy decisions
  preserveHistory: boolean;   // whether to record previous severity states (immutable audit trail)
  maxAutoDowngradeWindowHours?: number | null; // policy-level hint; null means "no auto-downgrade allowed here"
  note?: string;
}

/**
 * Canonical lifecycle policy (declarative).
 * - explicit allowed transitions
 * - default deny if not listed
 * - preserveHistory true by default (recommended)
 *
 * This file contains only policy, not enforcement or timing logic.
 */
export const DefaultLifecyclePolicy: LifecyclePolicy = {
  steward: 'incident-management',
  preserveHistory: true,
  maxAutoDowngradeWindowHours: null,
  note: 'Severity transitions require adherence to allowedTransitions and may require approval when marked.',
  allowedTransitions: [
    {
      from: 'SEV1',
      to: 'SEV2',
      allowed: false,
      reason: 'Escalation from critical to lower-severity not permitted without formal reclassification.',
      requiresApproval: true,
      preservingFields: ['incidentId', 'createdAt'],
    },
    {
      from: 'SEV2',
      to: 'SEV1',
      allowed: false,
      reason: 'Only formal reclassification may increase severity to SEV1.',
      requiresApproval: true,
      preservingFields: ['incidentId', 'createdAt'],
    },
    {
      from: 'SEV3',
      to: 'SEV2',
      allowed: true,
      reason: 'Escalation from moderate to high allowed when evidence supports it.',
      requiresApproval: true,
      preservingFields: ['incidentId', 'createdAt', 'severityHistory'],
    },
    {
      from: 'SEV2',
      to: 'SEV3',
      allowed: true,
      reason: 'De-escalation from high to moderate permitted after mitigation.',
      requiresApproval: false,
      preservingFields: ['incidentId', 'createdAt', 'severityHistory'],
    },
    {
      from: 'SEV4',
      to: 'SEV3',
      allowed: true,
      reason: 'Routine adjustments allowed.',
      requiresApproval: false,
      preservingFields: ['incidentId', 'createdAt', 'severityHistory'],
    },
    {
      from: 'SEV5',
      to: 'SEV4',
      allowed: true,
      reason: 'Informational -> low when validated.',
      requiresApproval: false,
      preservingFields: ['incidentId', 'createdAt', 'severityHistory'],
    },
    {
      from: 'ANY',
      to: 'SEV5',
      allowed: true,
      reason: 'Any incident may be reclassified as informational after resolution/validation.',
      requiresApproval: false,
      preservingFields: ['incidentId', 'createdAt', 'severityHistory'],
    },
  ],
};

/**
 * Helper: returns whether a transition is explicitly allowed by policy.
 * (Pure lookup; no side effects or enforcement.)
 */
export function isTransitionAllowed(
  policy: LifecyclePolicy,
  from: SeverityState,
  to: SeverityState
): TransitionRule | null {
  // Exact match first
  const exact = policy.allowedTransitions.find((t) => t.from === from && t.to === to);
  if (exact) return exact;
  // ANY match
  const anyMatch = policy.allowedTransitions.find((t) => t.from === 'ANY' && t.to === to);
  if (anyMatch) return anyMatch;
  return null; // unspecified => treat as denied by default
}