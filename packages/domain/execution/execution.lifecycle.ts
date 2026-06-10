// execution.lifecycle.ts

export type ExecutionState =
  | 'planned'
  | 'authorized'
  | 'executing'
  | 'completed'
  | 'verified'
  | 'closed';

export interface ExecutionTransition {
  from: ExecutionState | 'ANY';
  to: ExecutionState;
  allowed: boolean;

  /**
   * HUMAN DECISION:
   * What permits this transition?
   */
  reason?: string;
}

export interface ExecutionLifecyclePolicy {
  steward: string;
  preserveHistory: boolean;
  transitions: readonly ExecutionTransition[];
}

export const ExecutionLifecycle: ExecutionLifecyclePolicy = {
  steward: 'TODO',
  preserveHistory: true,
  transitions: [],
};