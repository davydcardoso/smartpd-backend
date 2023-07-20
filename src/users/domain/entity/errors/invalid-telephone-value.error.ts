import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidTelephoneValueError extends Error implements DomainError {
  constructor() {
    super('Numero de telefone informado está invalido');
    this.name = 'InvalidTelephoneValueError';
  }
}
