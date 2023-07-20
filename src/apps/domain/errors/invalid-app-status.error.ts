import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidAppStatusError extends Error implements DomainError {
  constructor() {
    super('O status do aplicativo informado está invalido');
    this.name = 'InvalidAppStatusError';
  }
}
