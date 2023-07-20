import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyAccountIsNotExistsInSystemError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Empresa informada não existe no sistema');
    this.name = 'CompanyAccountIsNotExistsInSystemError';
  }
}
