/**
 * 
 User
  ↓
Commands
  ↓
Workflows
  ↓
Domain
  ↓
Views
  ↓
UI

This is the façade everything else hangs off.
 */


import type {
  CaseProjection
} from '../case/case-projection';

import type {
  OperationalCaseEvent,
  OperationalCaseEvent,
} from '../case/case-results';

import type { CaseView } from '../case/case-view';

import type { CaseTimeline } from '../timeline/case-timeline';

export interface CaseService {
  createCase(
    command: CreateCaseCommand,
  ): Promise<CreateCaseResult>;

  getCase(
    caseId: string,
  ): Promise<CaseView>;

  getCaseTimeline(
    caseId: string,
  ): Promise<CaseTimeline>;

  identifyRootCause(
    command: IdentifyRootCauseCommand,
  ): Promise<CaseOperationResult>;

  selectResolution(
    command: SelectResolutionCommand,
  ): Promise<CaseOperationResult>;

  validateResolution(
    command: ValidateResolutionCommand,
  ): Promise<CaseOperationResult>;

  captureLearning(
    command: CaptureLearningCommand,
  ): Promise<CaseOperationResult>;
}



