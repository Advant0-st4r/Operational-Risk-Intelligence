export interface ResolutionSelectionWorkflow {
  execute(
    caseId: string,
    resolutionId: string,
  ): Promise<void>;
}