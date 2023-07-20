import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyIsNotExistsError extends Error implements UseCaseError {
  constructor() {
    super('Empresa informada não exite no sistema!');
    this.name = 'CompanyIsNotExistsError';
  }
}
