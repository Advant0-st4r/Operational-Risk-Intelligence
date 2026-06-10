// Priority decision layer: pure, injectable strategies to compute PriorityLevel from admissible inputs.
// No hard-coded business thresholds-- all scoring/thresholds provided via injected strategies.
// returns computed priority and diagnostic scores for audit based off injected strat.

import type {
  PriorityEvidenceRecord,
  PriorityEvidence,
  PriorityEvidenceMeta,
} from './priority.types';
import type { PriorityLevel } from './priority.contract';

/* Numeric scores used internally (0..100) */
export type SeverityScore = number;
export type CognitionScore = number;
export type CustomerImpactScore = number;
export type BusinessMetricScore = number;
export type OperationalCapacityScore = number;

/* Strategy interfaces — implementations supplied by platform integrators */

export interface SeverityScoringStrategy {
  scoreSeverity(evidence: PriorityEvidenceRecord[]): SeverityScore;
}

export interface CognitionScoringStrategy {
  scoreCognition(evidence: PriorityEvidenceRecord[]): CognitionScore;
}

export interface CustomerImpactStrategy {
  scoreCustomerImpact(evidence: PriorityEvidenceRecord[]): CustomerImpactScore;
}

export interface BusinessMetricStrategy {
  scoreBusinessImpact(evidence: PriorityEvidenceRecord[]): BusinessMetricScore;
}

export interface OperationalCapacityStrategy {
  scoreOperationalCapacity(evidence: PriorityEvidenceRecord[]): OperationalCapacityScore;
}

/**
 * PriorityDerivationStrategy maps component scores to a PriorityLevel.
 * Implementations may use weighted sums, decision trees, ML models, etc.-- supplied externally.
 */
export interface PriorityDerivationStrategy {
  derivePriority(params: {
    severityScore: SeverityScore;
    cognitionScore: CognitionScore;
    customerImpactScore: CustomerImpactScore;
    businessMetricScore: BusinessMetricScore;
    operationalCapacityScore: OperationalCapacityScore;
    manualOverride?: { level: PriorityLevel; reason?: string } | null;
    evidence?: PriorityEvidenceRecord[];
  }): PriorityLevel;
}

/* Small mapping helpers — pure and optional for callers */

export function normalizeScore(value: number, min = 0, max = 100): number {
  if (Number.isNaN(value)) return 0;
  if (value <= min) return 0;
  if (value >= max) return 100;
  return ((value - min) / (max - min)) * 100;
}

/* Core evaluation function — pure. */
export function evaluatePriority(
  evidence: PriorityEvidenceRecord[],
  severityScorer: SeverityScoringStrategy,
  cognitionScorer: CognitionScoringStrategy,
  customerImpactScorer: CustomerImpactStrategy,
  businessMetricScorer: BusinessMetricStrategy,
  operationalCapacityScorer: OperationalCapacityStrategy,
  derivationStrategy: PriorityDerivationStrategy
): {
  priority: PriorityLevel;
  scores: {
    severityScore: SeverityScore;
    cognitionScore: CognitionScore;
    customerImpactScore: CustomerImpactScore;
    businessMetricScore: BusinessMetricScore;
    operationalCapacityScore: OperationalCapacityScore;
  };
} {
  const severityScore = severityScorer.scoreSeverity(evidence);
  const cognitionScore = cognitionScorer.scoreCognition(evidence);
  const customerImpactScore = customerImpactScorer.scoreCustomerImpact(evidence);
  const businessMetricScore = businessMetricScorer.scoreBusinessImpact(evidence);
  const operationalCapacityScore = operationalCapacityScorer.scoreOperationalCapacity(evidence);

  const priority = derivationStrategy.derivePriority({
    severityScore,
    cognitionScore,
    customerImpactScore,
    businessMetricScore,
    operationalCapacityScore,
    manualOverride: extractManualOverride(evidence),
    evidence,
  });

  return {
    priority,
    scores: {
      severityScore,
      cognitionScore,
      customerImpactScore,
      businessMetricScore,
      operationalCapacityScore,
    },
  };
}

/* Helper: find a manual override evidence item if present */
export function extractManualOverride(evidence: PriorityEvidenceRecord[]): { level: PriorityLevel; reason?: string } | null {
  const override = evidence.find((e) => e.evidence.type === 'manual_override');
  if (!override) return null;
  const data = (override.evidence as any).data;
  if (!data || !data.level) return null;
  return { level: data.level as PriorityLevel, reason: data.reason };
}

/*
Notes:
- This module is intentionally a thin orchestration layer: it composes injected scoring strategies
  and a derivation strategy to compute a final PriorityLevel.
- All policy thresholds, weights, and decision logic must live in the injected strategies.
- The returned scores provide diagnostics for audit or tie-in with priority.audit structures elsewhere.
*/