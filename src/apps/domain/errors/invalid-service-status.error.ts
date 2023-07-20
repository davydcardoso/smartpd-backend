import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidServiceStatusError extends Error implements DomainError {
  constructor() {
    super('Status do serviço informado está invalido');
    this.name = 'InvalidServiceStatusError';
  }
}
