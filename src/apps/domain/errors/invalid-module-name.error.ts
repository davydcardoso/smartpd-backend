import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidServiceNameError extends Error implements DomainError {
  constructor() {
    super('Nome do modulo/serviço está invalido ');

    this.name = 'InvalidServiceNameError';
  }
}
