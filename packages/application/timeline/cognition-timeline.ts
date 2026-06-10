export interface CognitionTimelineEntry {
  timestamp: Date;

  cognitionState: string;

  evidence?: string;

  explanation?: string;
}

export interface CognitionTimeline {
  caseId: string;

  entries: readonly CognitionTimelineEntry[];
}