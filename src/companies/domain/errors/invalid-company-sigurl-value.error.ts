import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidCompanySigUrlValueError
  extends Error
  implements DomainError
{
  constructor() {
    super('A URL do SIG informada está invalda');
    this.name = 'InvalidCompanySigUrlValueError';
  }
}
