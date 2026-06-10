export interface CognitionAdvancementWorkflow {
  execute(caseId: string): Promise<void>;
}