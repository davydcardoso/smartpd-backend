import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidAppNameError extends Error implements DomainError {
  constructor() {
    super('O nome do aplicativo está invalido');
    this.name = 'InvalidAppNameError';
  }
}
