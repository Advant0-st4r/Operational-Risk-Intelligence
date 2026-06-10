export interface LearningCaptureWorkflow {
  execute(
    caseId: string,
    learning: string,
  ): Promise<void>;
}