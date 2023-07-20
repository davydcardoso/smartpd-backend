import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class RecoveryCodeOrInvalidPasswordChangeError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Codigo de recuperação ou alteração de senha invalido');
    this.name = 'RecoveryCodeOrInvalidPasswordChangeError';
  }
}
