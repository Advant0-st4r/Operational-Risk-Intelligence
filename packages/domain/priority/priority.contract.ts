/**
 * 
 * 
 * Purpose:
 * 
 severity:
  how_bad

cognition:
  what_we_know

priority:
  what_we_should_focus_on

  */


/**  Priority constitution: declarative contract describing what priority means and what minimal inputs
 * are required to assign or change priority. No algorithms or xplicit thresholds—policy... ownership only.
 * */

/**
 * Owner identifier (team, role, or system id).
 */
export type OwnerId = string;

/**
 * Canonical priority levels.
 * These labels are policy-level vocabulary; numeric mappings live in engines.
 */
export type PriorityLevel =
  | 'P1' // Highest priority — immediate attention
  | 'P2'
  | 'P3'
  | 'P4'
  | 'P5'; // Lowest

export interface PriorityRequirement {
  name: string;           // e.g., "severity", "cognition_state", "customer_impact"
  description?: string;   // human-readable intent
  owner: OwnerId;         // who must provide/verify this input
  mandatory: boolean;
  notes?: string;
}

/**
 * Priority constitution declaring which facets must be considered when assigning priority.
 * This file declares responsibilities and required inputs only.
 */
export interface PriorityConstitution {
  steward: OwnerId; // who owns priority policy
  preserveHistory: boolean;
  requiredInputs: PriorityRequirement[]; // canonical inputs to consider
  allowedOutputs: PriorityLevel[];       // permitted priority labels
  note?: string;
}

/**
 * Canonical contract (declarative).
 * - Severity and cognition are distinct inputs; priority combines them along with business/contextual inputs.
 */
export const PriorityContract: PriorityConstitution = {
  steward: 'incident-management',
  preserveHistory: true,
  requiredInputs: [
    {
      name: 'severity',
      description: 'The current incident severity (organizational SEV1..SEV5).',
      owner: 'incident-management',
      mandatory: true,
      notes: 'Severity is necessary but not sufficient to determine priority.',
    },
    {
      name: 'cognition_state',
      description: 'Current cognition lifecycle state (observed/understood/acted_upon/validated/archived).',
      owner: 'oncall',
      mandatory: true,
      notes: 'Priority decisions should consider how well the incident is understood.',
    },
    {
      name: 'customer_impact',
      description: 'Admissible measures of affected customers or SLAs.',
      owner: 'product',
      mandatory: false,
      notes: 'High customer visibility may increase priority even at lower severity.',
    },
    {
      name: 'business_metrics',
      description: 'Relevant business metrics (revenue exposure, market impact).',
      owner: 'business-risk',
      mandatory: false,
      notes: 'May be used by prioritization engine when available.',
    },
    {
      name: 'operational_capacity',
      description: 'Current availability of responders (on-call load, blackout windows).',
      owner: 'ops',
      mandatory: false,
      notes: 'Used to influence scheduling/dispatch decisions.',
    },
  ],
  allowedOutputs: ['P1', 'P2', 'P3', 'P4', 'P5'],
  note: 'Priority merges severity + cognition + contextual inputs; this contract declares required inputs and ownership only.',
};

/**
 * Small pure helpers to read the contract.
 */

export function getRequiredInputs(): PriorityRequirement[] {
  return PriorityContract.requiredInputs;
}

export function isInputMandatory(name: string): boolean {
  return Boolean(PriorityContract.requiredInputs.find((r) => r.name === name && r.mandatory));
}