import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidMotherNameValueError extends Error implements UseCaseError {
  constructor() {
    super('Nome da mãe não informado ou invalido');
    this.name = 'InvalidMotherNameValueError';
  }
}
