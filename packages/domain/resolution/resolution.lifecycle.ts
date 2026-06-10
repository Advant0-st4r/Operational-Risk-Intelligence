// resolution.lifecycle.ts

export type ResolutionState =
  | 'proposed'
  | 'selected'
  | 'executing'
  | 'executed'
  | 'validated'
  | 'retired';

export interface ResolutionTransition {
  from: ResolutionState | 'ANY';
  to: ResolutionState;
  allowed: boolean;

  /**
   * HUMAN DECISION:
   * Why is this transition permitted?
   */
  reason?: string;

  /**
   * HUMAN DECISION:
   * What evidence is required?
   */
  requiredEvidence?: readonly string[];
}

export interface ResolutionLifecyclePolicy {
  steward: string;
  preserveHistory: boolean;
  transitions: readonly ResolutionTransition[];
}

export const ResolutionLifecycle: ResolutionLifecyclePolicy = {
  steward: 'TODO',
  preserveHistory: true,
  transitions: [],
};