export interface CaseTimelineEntry {
  timestamp: Date;

  type: string;

  description: string;
}

export interface CaseTimeline {
  caseId: string;

  entries: readonly CaseTimelineEntry[];
}