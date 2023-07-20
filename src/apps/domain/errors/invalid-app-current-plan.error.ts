import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidAppCurrentPlanError
  extends Error
  implements DomainError
{
  constructor() {
    super('O plano do aplicativo informado é invalido');
    this.name = 'InvalidModuleCurrentPlanError';
  }
}
