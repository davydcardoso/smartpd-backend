import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidServiceDescriptionError
  extends Error
  implements DomainError
{
  constructor() {
    super('Descrição do modulo/serviço está invalida');
    this.name = 'InvalidServiceDescriptionError';
  }
}
