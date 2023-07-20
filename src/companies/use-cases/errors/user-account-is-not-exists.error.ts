import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class UserAccountIsNotExistsError extends Error implements UseCaseError {
  constructor() {
    super('Usuário nao existe no sistema');
    this.name = 'UserAccountIsNotExistsError';
  }
}
