import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class TheCompanyRegistrationIsAlreadyDisabledError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('O cadastro da empresa já esta desabilitado');
    this.name = 'TheCompanyRegistrationIsAlreadyDisabledError';
  }
}
