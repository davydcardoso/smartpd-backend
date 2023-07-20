import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class PasswordChangeAlreadyRequestedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(
      'Você já atingiu a quantidade maxima de solicitações de alterações de senha',
    );
    this.name = 'PasswordChangeAlreadyRequestedError';
  }
}
