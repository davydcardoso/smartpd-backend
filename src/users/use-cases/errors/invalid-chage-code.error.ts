import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidChangeCodeError extends Error implements UseCaseError {
  constructor() {
    super('Codigo de alteração não informado ou invalido');
    this.name = 'InvalidChangeCodeError';
  }
}
