import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class ExpiredPasswordChangeCodeError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Codigo de alteração de senha expirado');
    this.name = 'ExpiredPasswordChangeCodeError';
  }
}
