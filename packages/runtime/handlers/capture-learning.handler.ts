import type { CaptureLearningCommand }
  from '../commands/capture-learning.command';

import type { LearningCaptureWorkflow }
  from '../../application/workflows/learning-capture.workflow';

export interface CaptureLearningHandler {
  handle(
    command: CaptureLearningCommand,
  ): Promise<void>;
}