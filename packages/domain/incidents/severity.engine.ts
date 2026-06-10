// severity.engine.ts

// Evaluation layer: pure, deterministic functions that take admissible evidence and produce -- can definitely be llm-evaluable in complex, adaptive, self-reinforcing use-cases
// ImpactLevel, UrgencyLevel, and (optionally) a derived SeverityLevel.
// This file intentionally contains no hard-coded organizational numeric thresholds; it
// accepts configurable evaluation strategies via dependency injection (strategy objects).
// No side effects, no I/O, no ownership assertions — just pure functions and small helpers.

import type {
  EvidenceRecord,
  SeverityEvidence,
  EvidenceProvenance,
} from './severity.types';
import type { ImpactLevel, UrgencyLevel, SeverityLevel, IncidentSeverity } from './incident.severity';
import type { MeasureContract } from './severity.contract';

/*
  interfaces
  - Implementations (outside this file) encode organization-specific thresholds and weights.
  - Each strategy must be a pure function mapping admissible evidence to a scored numeric domain.
*/

export type ImpactScore = number; // higher = greater impact (0..,100 recommended)
export type UrgencyScore = number; // higher = more urgent (0...100 recommended)

export interface ImpactEvaluationStrategy {
  // Map admissible impact evidence to a numeric score.
  evaluateImpactScore(evidence: EvidenceRecord[]): ImpactScore;
}

export interface UrgencyEvaluationStrategy {
  // Map admissible urgency evidence to a numeric score.
  evaluateUrgencyScore(evidence: EvidenceRecord[]): UrgencyScore;
}

export interface SeverityDerivationStrategy {
  // Map numeric impact+urgency scores to a SeverityLevel string.
  deriveSeverityLevel(impact: ImpactScore, urgency: UrgencyScore): SeverityLevel;
}

/*
  Simple configurable mappers: convert numeric scores into categorical levels.
  These use boundaries supplied by the caller (no defaults embedded).
*/

export interface ScoreToImpactLevelConfig {
  lowToMinor: number;    // maximum score for NONE|MINOR boundary
  minorToMajor: number;  // maximum score for MINOR|MAJOR boundary
  majorToCritical: number;// maximum score for MAJOR|CRITICAL boundary
}

export interface ScoreToUrgencyLevelConfig {
  lowToMedium: number;
  mediumToHigh: number;
  highToImmediate: number;
}

/**
 * Pure mapping functions that require explicit boundary objects.
 * Caller must provide configs derived from policy; these functions perform deterministic mapping only.
 */

export function mapImpactScoreToLevel(score: ImpactScore, cfg: ScoreToImpactLevelConfig): ImpactLevel {
  if (score <= cfg.lowToMinor) return 'NONE';
  if (score <= cfg.minorToMajor) return 'MINOR';
  if (score <= cfg.majorToCritical) return 'MAJOR';
  return 'CRITICAL';
}

export function mapUrgencyScoreToLevel(score: UrgencyScore, cfg: ScoreToUrgencyLevelConfig): UrgencyLevel {
  if (score <= cfg.lowToMedium) return 'LOW';
  if (score <= cfg.mediumToHigh) return 'MEDIUM';
  if (score <= cfg.highToImmediate) return 'HIGH';
  return 'IMMEDIATE';
}

/*
  Core evaluation functions (pure).
  - evaluateImpact accepts evidence + an ImpactEvaluationStrategy implementation and returns an ImpactLevel
    (plus the numeric score in case callers want to log or make decisions).
  - evaluateUrgency does the same for urgency.
  - deriveSeverity accepts the numeric scores and a derivation strategy to produce a SeverityLevel.
*/

export function evaluateImpact(
  evidence: EvidenceRecord[],
  strategy: ImpactEvaluationStrategy,
  mapperCfg: ScoreToImpactLevelConfig
): { impact: ImpactLevel; score: ImpactScore } {
  const score = strategy.evaluateImpactScore(evidence);
  const impact = mapImpactScoreToLevel(score, mapperCfg);
  return { impact, score };
}

export function evaluateUrgency(
  evidence: EvidenceRecord[],
  strategy: UrgencyEvaluationStrategy,
  mapperCfg: ScoreToUrgencyLevelConfig
): { urgency: UrgencyLevel; score: UrgencyScore } {
  const score = strategy.evaluateUrgencyScore(evidence);
  const urgency = mapUrgencyScoreToLevel(score, mapperCfg);
  return { urgency, score };
}

export function deriveSeverity(
  impactScore: ImpactScore,
  urgencyScore: UrgencyScore,
  strategy: SeverityDerivationStrategy
): { overall: SeverityLevel } {
  const overall = strategy.deriveSeverityLevel(impactScore, urgencyScore);
  return { overall };
}

/*
  Small helper: evaluate end-to-end given evidence and injected strategies/configs.
  Returns the IncidentSeverity vocabulary plus the raw numeric scores (for audit/logging).
  This function is still pure and returns a value only.
*/

export function evaluateIncidentSeverity(
  evidence: EvidenceRecord[],
  impactStrategy: ImpactEvaluationStrategy,
  urgencyStrategy: UrgencyEvaluationStrategy,
  derivationStrategy: SeverityDerivationStrategy,
  impactMapperCfg: ScoreToImpactLevelConfig,
  urgencyMapperCfg: ScoreToUrgencyLevelConfig
): { incidentSeverity: IncidentSeverity; impactScore: ImpactScore; urgencyScore: UrgencyScore } {
  const { impact, score: impactScore } = evaluateImpact(evidence, impactStrategy, impactMapperCfg);
  const { urgency, score: urgencyScore } = evaluateUrgency(evidence, urgencyStrategy, urgencyMapperCfg);
  const { overall } = deriveSeverity(impactScore, urgencyScore, derivationStrategy);

  const incidentSeverity: IncidentSeverity = {
    impact,
    urgency,
    overall,
  };

  return { incidentSeverity, impactScore, urgencyScore };
}

/*
  Notes:
  - No thresholds or policy decisions are hard-coded here. All mapping boundaries and scoring algorithms
    are injected via strategy objects and config params.
  - Implementations of the evaluation strategies should validate evidence types against admissible measures
    (from severity.types and severity.contract) before scoring; that responsibility is intentionally external.
  - This module is deterministic and side-effect free to facilitate testing and reasoning.
*/