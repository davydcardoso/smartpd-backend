import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidAppVersionError extends Error implements DomainError {
  constructor() {
    super('Versão do aplicativo informada não é  valida');
    this.name = 'InvalidAppVersionError';
  }
}
