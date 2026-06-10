export interface CaseView {
  caseId: string;

  title: string;

  service: string;

  severity: string;

  cognitionState: string;

  priority: string;

  rootCause?: string;

  resolution?: string;

  learning?: string;

  createdAt: Date;

  updatedAt: Date;
}