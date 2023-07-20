import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidParamUserIdError extends Error implements UseCaseError {
  constructor() {
    super('Usuário id não informado ou invalido');
    this.name = 'InvalidParamUserIdError';
  }
}
