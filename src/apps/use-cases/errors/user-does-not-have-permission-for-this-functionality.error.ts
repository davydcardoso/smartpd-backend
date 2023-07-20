import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class UserDoesNotHavePermissionForThisFunctionalityError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Usuário não possui permissão para acessar está funcionalidade!');
    this.name = 'UserDoesNotHavePermissionForThisFunctionalityError';
  }
}
