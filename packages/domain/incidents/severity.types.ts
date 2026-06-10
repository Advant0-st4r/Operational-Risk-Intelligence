// severity.types.ts
// Allowed evidence types for severity evaluation. No algorithms or usage rules—only admissible shapes.

export type BusinessMetrics = {
  revenueLossEstimate?: number; // monetary estimate (optional)
  affectedUsers?: number;
  percentTrafficDrop?: number; // 0-100
  note?: string;
};

export type CustomerImpact = {
  impactedCustomerSegments?: string[]; // e.g., ["enterprise", "consumer"]
  severityOfExperience?: 'none' | 'annoyance' | 'functional_loss' | 'blocked';
  supportEscalations?: number;
  note?: string;
};

export type FinancialLoss = {
  estimatedLossUSD?: number;
  confirmedLossUSD?: number;
  note?: string;
};

export type RegulatoryExposure = {
  regulationIds?: string[]; // identifiers for applicable regulations
  potentialFinesUSD?: number;
  reportingRequired?: boolean;
  note?: string;
};

export type TimeConstraints = {
  timeToIrreversibleDamageHours?: number;
  deadlineISO?: string; // ISO 8601 timestamp (if applicable)
  note?: string;
};

export type OperationalDeadlines = {
  affectedProcesses?: string[];
  missedSLAs?: boolean;
  slaBreachCount?: number;
  note?: string;
};

// Union of admissible evidence items (discriminated by 'type' when used)
export type SeverityEvidence =
  | { type: 'business_metrics'; data: BusinessMetrics }
  | { type: 'customer_impact'; data: CustomerImpact }
  | { type: 'financial_loss'; data: FinancialLoss }
  | { type: 'regulatory_exposure'; data: RegulatoryExposure }
  | { type: 'time_constraints'; data: TimeConstraints }
  | { type: 'operational_deadlines'; data: OperationalDeadlines };

// Metadata about evidence provenance (who submitted, when, confidence)
export type EvidenceProvenance = {
  submittedBy?: string; // owner id or system id
  submittedAtISO?: string; // ISO 8601 timestamp
  confidence?: 'low' | 'medium' | 'high';
  source?: 'automated' | 'manual' | 'third_party';
  note?: string;
};

// Wrapper used by the engine later (declarative only)
export interface EvidenceRecord {
  id: string;
  evidence: SeverityEvidence;
  provenance?: EvidenceProvenance;
}