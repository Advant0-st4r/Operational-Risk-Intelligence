/**
 * 
 * 
 * MANUAL BUILD
 * 
 * 
 * Defines:

  What is a resolution?

  What responsibility does it carry?

  When is a resolution considered selected?

  What relationship exists between:
    incident
    root_cause
    resolution
 */



/** 
ResolutionConstitution:

  resolution:
    definition

  selection:
    definition

  effectiveness:
    definition

  ownership:
    steward

  requirements:

    resolution_must_address_root_cause

    resolution_must_be_traceable

    resolution_must_be_reviewable 
*/



// resolution.contract.ts

export interface ResolutionConstitution {
  /**
   * HUMAN DECISION:
   * Define what a resolution is.
   */
  resolutionDefinition: string;

  /**
   * HUMAN DECISION:
   * Define when a resolution is considered selected.
   */
  selectionDefinition: string;

  /**
   * HUMAN DECISION:
   * Define what constitutes effectiveness.
   */
  effectivenessDefinition: string;

  steward: string;

  requirements: readonly string[];
}

export const ResolutionContract: ResolutionConstitution = {
  resolutionDefinition: 'TODO',
  selectionDefinition: 'TODO',
  effectivenessDefinition: 'TODO',
  steward: 'TODO',
  requirements: [],
};
