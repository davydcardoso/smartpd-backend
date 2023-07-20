import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidServicePathUrlError extends Error implements DomainError {
  constructor() {
    super('Base url informada está invalida');
    this.name = 'InvalidServicePathUrlError';
  }
}
