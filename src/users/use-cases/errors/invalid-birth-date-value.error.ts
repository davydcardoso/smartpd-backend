import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidBirthDateValueError extends Error implements UseCaseError {
  constructor() {
    super('Data de não é valida!');
    this.name = 'InvalidBirthDateValueError';
  }
}
