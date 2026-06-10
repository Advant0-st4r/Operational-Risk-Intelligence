export interface CognitionAdvancedEvent {
  caseId: string;

  previousState: string;

  currentState: string;

  occurredAt: Date;
}