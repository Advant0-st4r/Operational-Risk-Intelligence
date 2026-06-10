// learning.lifecycle.ts

export type LearningState =
  | 'identified'
  | 'documented'
  | 'accepted'
  | 'implemented'
  | 'verified'
  | 'institutionalized';

export interface LearningTransition {
  from: LearningState | 'ANY';
  to: LearningState;
  allowed: boolean;

  /**
   * HUMAN DECISION:
   * Why is this transition valid?
   */
  reason?: string;
}

export interface LearningLifecyclePolicy {
  steward: string;
  preserveHistory: boolean;
  transitions: readonly LearningTransition[];
}

export const LearningLifecycle: LearningLifecyclePolicy = {
  steward: 'TODO',
  preserveHistory: true,
  transitions: [],
};