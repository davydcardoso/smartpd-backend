import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidServiceStatusValueError
  extends Error
  implements DomainError
{
  constructor() {
    super('O tipo informado para o serviço é invalido');
    this.name = 'InvalidServiceStatusValueError';
  }
}
