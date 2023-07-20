import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class ItIsNotPossibleToChangeTheStatusOfThisCustomerError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Não foi possivel alterar o status deste cliente');
    this.name = 'ItIsNotPossibleToChangeTheStatusOfThisCustomerError';
  }
}
