/**
 * 
 * Purpose:

signal

  ->

deduplication

  ->

severity

  ->

cognition

  ->

priority

  ->

case

This is your first real end-to-end value chain.

*/



import type { CreateCaseCommand } from '../case/case-commands';
import type { CreateCaseResult } from '../case/case-results';

export interface IncidentIntakeWorkflow {
  execute(
    command: CreateCaseCommand,
  ): Promise<CreateCaseResult>;
}