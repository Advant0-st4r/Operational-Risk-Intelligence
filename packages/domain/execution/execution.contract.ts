// execution.contract.ts

export interface ExecutionConstitution {
  /**
   * HUMAN DECISION:
   * Define execution.
   */
  executionDefinition: string;

  /**
   * HUMAN DECISION:
   * What may be automated?
   */
  automatedActions: readonly string[];

  /**
   * HUMAN DECISION:
   * What requires human approval?
   */
  humanRequiredActions: readonly string[];

  steward: string;
}

export const ExecutionContract: ExecutionConstitution = {
  executionDefinition: 'TODO',
  automatedActions: [],
  humanRequiredActions: [],
  steward: 'TODO',
};