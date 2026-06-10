import type { ValidateResolutionCommand }
  from '../commands/validate-resolution.command';

import type { ValidationWorkflow }
  from '../../application/workflows/validation.workflow';

export interface ValidateResolutionHandler {
  handle(
    command: ValidateResolutionCommand,
  ): Promise<void>;
}