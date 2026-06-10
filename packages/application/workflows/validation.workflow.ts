export interface ValidationWorkflow {
  execute(
    caseId: string,
    evidence: string,
  ): Promise<void>;
}