import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidCompanyStatusError extends Error implements DomainError {
  constructor() {
    super('Status da empresa informado é invalido');
    this.name = 'InvalidCompanyStatusError';
  }
}
