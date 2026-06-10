/**
 * 
 * Classification
classification:
  MUST_BUILD_MANUALLY

because severity becomes the allocator of:

attention:
priority:
escalation:
resource_commitment:

and those are ownership decisions


 */





/**
 * incident.severity.ts:

  measures:
    - impact: business_damage
    - urgency: time_to_irreversible_damage

  does_not_measure:
    - root_cause_quality
    - remediation_quality
    - cognitive_priority
    - team_capacity
    - business_context

  formula:
    severity =
      weighted(impact, urgency)
 */


/**
 * 
 * Finalized architectural definition:
 * 
 responsibility:
  define:
    - ImpactLevel:  sev1-sev4
    - UrgencyLevel:  sev1-sev4
    - SeverityLevel:  sev1-sev4

not_responsible_for:
    - scoring
    - calculations
    - weighting
    - ranking
    - prioritization
 * 
 */



// incident.severity.ts
// Pure vocabulary: no thresholds, no algorithms, only types/values that describe severity.

export type ImpactLevel =
  | 'NONE'      // no measurable impact
  | 'MINOR'     // small, localized impact
  | 'MAJOR'     // significant impact to important functions or many users
  | 'CRITICAL'  // widespread or severe impact affecting core systems
  | 'CATASTROPHIC'; // existential or systemic failure

export type UrgencyLevel =
  | 'LOW'       // no immediate action required
  | 'MEDIUM'    // action recommended within normal SLAs
  | 'HIGH'      // swift action required to avoid escalation
  | 'IMMEDIATE';// immediate intervention required

export type SeverityLevel =
  | 'SEV5' // Informational / no actionable severity
  | 'SEV4' // Low
  | 'SEV3' // Moderate
  | 'SEV2' // High
  | 'SEV1';// Critical

export interface IncidentSeverity {
  impact: ImpactLevel;
  urgency: UrgencyLevel;
  overall?: SeverityLevel; // optional: can be filled by later evaluation/derivation
}
