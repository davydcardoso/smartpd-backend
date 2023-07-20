import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyAccountIsNotActivedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('O cadastro do cliente não está ativado no sistema');
    this.name = 'CompanyAccountIsNotActivedError';
  }
}
