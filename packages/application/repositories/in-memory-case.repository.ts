import type { OperationalCase }
  from '../../application/case/operational-case';

import type { CaseRepository }
  from '../../application/repositories/case.repository';

export class InMemoryCaseRepository
  implements CaseRepository
{
  private readonly store =
    new Map<string, OperationalCase>();

  async save(
    operationalCase: OperationalCase,
  ): Promise<void> {
    this.store.set(
      operationalCase.id,
      operationalCase,
    );
  }

  async findById(
    caseId: string,
  ): Promise<OperationalCase | null> {
    return this.store.get(caseId) ?? null;
  }

  async exists(
    caseId: string,
  ): Promise<boolean> {
    return this.store.has(caseId);
  }

  async delete(
    caseId: string,
  ): Promise<void> {
    this.store.delete(caseId);
  }
}