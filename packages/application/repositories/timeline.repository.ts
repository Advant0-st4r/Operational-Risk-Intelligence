import type { CaseTimeline }
  from '../timeline/case-timeline';

export interface TimelineRepository {
  save(
    timeline: CaseTimeline,
  ): Promise<void>;

  findByCaseId(
    caseId: string,
  ): Promise<CaseTimeline | null>;
}