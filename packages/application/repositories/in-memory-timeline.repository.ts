import type { TimelineRepository }
  from '../../application/repositories/timeline.repository';

import type { CaseTimeline }
  from '../../application/timeline/case-timeline';

export class InMemoryTimelineRepository
  implements TimelineRepository
{
  private readonly store =
    new Map<string, CaseTimeline>();

  async save(
    timeline: CaseTimeline,
  ): Promise<void> {
    this.store.set(
      timeline.caseId,
      timeline,
    );
  }

  async findByCaseId(
    caseId: string,
  ): Promise<CaseTimeline | null> {
    return this.store.get(caseId) ?? null;
  }
}