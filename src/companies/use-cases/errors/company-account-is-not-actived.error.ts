import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyAccountIsNotActivedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Empresa informada não está ativada em nosso sistema');
    this.name = 'CompanyAccountIsNotActivedError';
  }
}
