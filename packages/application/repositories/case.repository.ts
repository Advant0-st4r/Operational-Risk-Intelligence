import type { OperationalCase }
  from '../case/operational-case';

export interface CaseRepository {
  save(
    operationalCase: OperationalCase,
  ): Promise<void>;

  findById(
    caseId: string,
  ): Promise<OperationalCase | null>;

  delete(
    caseId: string,
  ): Promise<void>;
}