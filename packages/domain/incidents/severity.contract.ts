// severity.contract.ts
// Ownership contract: declares canonical measures and how severity may be derived.
// No algorithms, no numeric thresholds, only structural contracts and responsibilities.

/**
 * Owners: which team/entity is responsible for each measure.
 * (Values are identifiers; concrete owner resolution happens elsewhere.)
 */
export type OwnerId = string;

export interface MeasureContract {
  name: string;           // canonical measure name (such as, "business_damage")
  description?: string;   // short human-readable intent
  owner: OwnerId;         // who owns the measure
  admissible: boolean;    // whether this measure is allowed as evidence for severity
}

/**
 * Canonical measures referenced by the severity constitution.
 * These are declarative entries only (no evaluation logic).
 */
export const ImpactMeasures: readonly MeasureContract[] = [
  {
    name: 'business_damage',
    description: 'Quantifies business impact (revenue, SLAs, customer churn risk).',
    owner: 'business-risk',
    admissible: true,
  },
];

export const UrgencyMeasures: readonly MeasureContract[] = [
  {
    name: 'time_to_irreversible_damage',
    description: 'Estimated time until damage becomes irreversible or significantly harder to remediate.',
    owner: 'ops',
    admissible: true,
  },
];

/**
 * Declares which higher-level facets compose severity and who owns the derivation decision.
 * This is a constitution-level statement: severity is derived from impact and urgency.
 */
export interface SeverityConstitution {
  derivedFrom: readonly ('impact' | 'urgency')[];
  steward: OwnerId; // who decides policy for derivation (not the algorithm)
  preserveHistory: boolean; // whether severity transitions must be recorded (policy flag)
}

export const SeverityContract: SeverityConstitution = {
  derivedFrom: ['impact', 'urgency'],
  steward: 'incident-management',
  preserveHistory: true,
};

/**
 * Policy marker: allowed severity outputs that conform to organization policy.
 * (No mapping logic here — just the criteria set.)
 */
export const AllowedSeverityOutputs: readonly string[] = [
  'SEV1',
  'SEV2',
  'SEV3',
  'SEV4',
  'SEV5',
];

/**
 * Notes, for now:
 * - This file intentionally contains no numeric thresholds or algorithmic derivation.
 * - It declares ownership, admissible measures, and the constitutional rule that severity is derived
 *   from impact and urgency. Concrete evaluation belongs in severity.engine.ts.
 */
