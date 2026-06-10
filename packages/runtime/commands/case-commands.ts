export interface CreateCaseCommand {
  title: string;
  serviceId: string;
  signal: string;
}

export interface IdentifyRootCauseCommand {
  caseId: string;
  rootCauseId: string;
}

export interface SelectResolutionCommand {
  caseId: string;
  resolutionId: string;
}

export interface ValidateResolutionCommand {
  caseId: string;
  validationEvidence: string;
}

export interface CaptureLearningCommand {
  caseId: string;
  learning: string;
}