/**
 * 
 * Purpose:

Convert domain objects into something renderable.

Input:

incident
severity
cognition
priority
resolution

Output:

Case View Model


*/

export interface CaseProjection {
  caseId: string;

  title: string;

  severity: string;

  cognition: string;

  priority: string;

  rootCause?: string;

  resolution?: string;

  learning?: string;
}