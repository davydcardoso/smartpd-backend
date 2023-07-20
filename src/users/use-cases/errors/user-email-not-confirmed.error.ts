import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class UserEmailNotConfirmedError extends Error implements UseCaseError {
  constructor() {
    super(
      'Nâo é possivel executar está ação, o email da sua conta não foi confirmado ',
    );
    this.name = 'UserEmailNotConfirmedError';
  }
}
