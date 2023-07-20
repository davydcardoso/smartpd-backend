import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class PasswordAlreadyInUseError extends Error implements UseCaseError {
  constructor() {
    super('Está senha já está sendo utilizada, favor tente novamente');
    this.name = 'PasswordAlreadyInUseError';
  }
}
