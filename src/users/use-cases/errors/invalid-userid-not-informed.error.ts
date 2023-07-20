import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidUserIdNotInformedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Não foi informado o id do usuário');
    this.name = 'InvalidUserIdNotInformedError';
  }
}
