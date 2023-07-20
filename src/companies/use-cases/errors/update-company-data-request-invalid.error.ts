import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class UpdateCompanyDataRequestInvalidError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Dados da requisição estão invalidos, tente novamente');
    this.name = 'UpdateCompanyDataRequestInvalidError';
  }
}
