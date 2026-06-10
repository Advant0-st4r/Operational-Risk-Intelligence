export interface CaseService {
  createCase(input: unknown): Promise<unknown>;

  getCase(caseId: string): Promise<unknown>;

  getCaseTimeline(caseId: string): Promise<unknown>;

  advanceCognition(input: unknown): Promise<void>;

  selectResolution(input: unknown): Promise<void>;

  captureLearning(input: unknown): Promise<void>;
}