/** 
 * Cognition transition evaluation: pure, deterministic functions that assess whether cognition 
 * may advance given admissible evidence and injected policy checks. No side effects, no I/O.
 * All thresholds, validators, and approval checks are provided via injected strategy objects. 
*/


/*
  Imports (types only to keep this module declarative/pure).
*/
import type {
  CognitionEvidenceRecord,
  CognitionEvidence,
} from './cognition.types';
import type {
  CognitionState,
  StateRequirement,
  CognitionConstitution,
} from './cognition.contract';
import type { CognitionLifecyclePolicy, CognitionTransition } from './cognition.lifecycle';
import type {
  CognitionTransitionExplanation,
  CognitionAuditRecord,
} from './cognition.audit';

/*
  Strategy interfaces:
  - EvidenceValidator: determines whether a given evidence record satisfies a named requirement.
  - ApprovalChecker: determines whether a transition that requires approval has been approved.
  - TransitionDecider: (optional) maps evidence + validators to a boolean decision for a transition.
  These are injected so organizational policy and thresholds live outside this module.
*/

export interface EvidenceValidator {
  /**
   * Return true if the supplied evidence records satisfy the requirement.
   * - requirementName is a canonical name from the cognition contract (e.g., "root_cause").
   * - evidence is the available evidence for the incident (may include unrelated items).
   * - contract may be consulted by implementations for additional context.
   */
  validateRequirement(requirementName: string, evidence: CognitionEvidenceRecord[], contract?: CognitionConstitution): boolean;
}

export interface ApprovalChecker {
  /**
   * Return true if the required approval for the transition has been granted.
   * If the transition does not require approval, implementations may return true.
   */
  isApproved(transition: CognitionTransition, actor?: string): boolean;
}

/**
 * Optional higher-level policy decider that can implement composite checks (timing, confidence thresholds).
 * If omitted, the engine falls back to per-requirement validators + lifecycle policy allowedTransitions.
 */
export interface TransitionDecider {
  canTransition(
    from: CognitionState,
    to: CognitionState,
    evidence: CognitionEvidenceRecord[],
    contract: CognitionConstitution,
    lifecycle: CognitionLifecyclePolicy
  ): { allowed: boolean; reason?: string; confidence?: 'low' | 'medium' | 'high' };
}

/*
  Core pure functions:
  - mayTransition: checks lifecycle policy and requirement validators to decide if a transition is permitted.
  - buildTransitionExplanation: constructs a CognitionTransitionExplanation suitable for audit.
  - makeAuditRecord: composes a CognitionAuditRecord tying decision and per-evidence explanations.
*/

/**
 * Determine whether a cognition state transition is permitted.
 * - Uses lifecycle policy to check allowedTransitions.
 * - Uses EvidenceValidator to ensure all mandatory requirements for the target state are satisfied.
 * - Uses ApprovalChecker if the transition requires approval.
 * - If a TransitionDecider is supplied, defer to it for the final decision (it may consult timing/confidence).
 *
 * This function is pure and performs no side effects.
 */

export function mayTransition(
  from: CognitionState,
  to: CognitionState,
  evidence: CognitionEvidenceRecord[],
  contract: CognitionConstitution,
  lifecycle: CognitionLifecyclePolicy,
  validator: EvidenceValidator,
  approver: ApprovalChecker,
  decider?: TransitionDecider,
  actor?: string // optional actor requesting transition (used for approval checks)
): { allowed: boolean; reason?: string; confidence?: 'low' | 'medium' | 'high' } {
  // Check lifecycle policy first (exact or ANY)
  const transitionRule = lifecycle.allowedTransitions.find((t) => t.from === from && t.to === to)
    || lifecycle.allowedTransitions.find((t) => t.from === 'ANY' && t.to === to);

  if (!transitionRule) {
    return { allowed: false, reason: 'Transition not allowed by lifecycle policy' };
  }

  if (!transitionRule.allowed) {
    return { allowed: false, reason: transitionRule.reason ?? 'Explicitly denied by lifecycle policy' };
  }

  // Validate required state requirements from contract for target state
  const requirements = contract.states[to].requires ?? [];
  for (const req of requirements) {
    if (req.mandatory) {
      const ok = validator.validateRequirement(req.name, evidence, contract);
      if (!ok) {
        return { allowed: false, reason: `Mandatory requirement not satisfied: ${req.name}` };
      }
    }
  }

  // If approval required by lifecycle rule, check via approver
  if (transitionRule.requiresApproval) {
    const approved = approver.isApproved(transitionRule, actor);
    if (!approved) {
      return { allowed: false, reason: 'Transition requires approval and none was found' };
    }
  }

  // If a decider exists, let it make the final call (may add confidence/reason)
  if (decider) {
    return decider.canTransition(from, to, evidence, contract, lifecycle);
  }

  // Default allow if all mandatory requirements are met and approvals (if any) present
  return { allowed: true, reason: 'All mandatory requirements satisfied and policy allows transition', confidence: 'medium' };
}

/**
 * Build a transition explanation suitable for audit storing.
 * Pure constructor — no persistence.
 */
export function buildTransitionExplanation(params: {
  id: string;
  incidentId?: string;
  from: CognitionState;
  to: CognitionState;
  triggerEvidenceIds: string[];
  rationale: string;
  createdBy?: string;
  createdAtISO: string;
  automated?: boolean;
  approver?: string | null;
  confidence?: 'low' | 'medium' | 'high';
}): CognitionTransitionExplanation {
  return {
    id: params.id,
    incidentId: params.incidentId,
    from: params.from,
    to: params.to,
    triggerEvidenceIds: params.triggerEvidenceIds,
    rationale: params.rationale,
    createdBy: params.createdBy,
    createdAtISO: params.createdAtISO,
    automated: params.automated ?? false,
    approver: params.approver ?? null,
    confidence: params.confidence ?? 'medium',
    note: undefined,
  };
}

/**
 * Compose a CognitionAuditRecord from the decision outcome and per-evidence rationales.
 * Consumers should persist the returned object if they intend to keep an audit trail.
 */
export function makeAuditRecord(params: {
  auditId: string;
  incidentId?: string;
  previousState?: CognitionState | null;
  resultingState?: CognitionState | null;
  transitionExplanation?: CognitionTransitionExplanation | null;
  evidenceExplanations?: { evidenceId: string; evidenceType: string; summary: string; contribution: 'supports' | 'contradicts' | 'neutral'; confidence?: 'low' | 'medium' | 'high' }[];
  notes?: string;
}): CognitionAuditRecord {
  const evidenceExplanations = (params.evidenceExplanations ?? []).map((e, idx) => ({
    id: `${params.auditId}-ev-${idx}`,
    incidentId: params.incidentId,
    evidenceId: e.evidenceId,
    evidenceType: e.evidenceType,
    summary: e.summary,
    contribution: e.contribution,
    confidence: e.confidence ?? 'medium',
    createdBy: undefined,
    createdAtISO: new Date().toISOString(),
    note: undefined,
  }));

  return {
    auditId: params.auditId,
    incidentId: params.incidentId,
    transition: params.transitionExplanation ?? null,
    evidenceExplanations,
    previousCognitionState: params.previousState ?? null,
    resultingCognitionState: params.resultingState ?? null,
    notes: params.notes,
  };
}

/*
  Notes:
  - This module keeps cognition policy and evaluation pure and injectable.
  - This is an exciting but heavily-assisted engine.
  - Concrete validators, approvers, and deciders should be implemented separately and passed in.
  - Persistence, notification, and side-effects belong to orchestration layers that call into these functions.
*/