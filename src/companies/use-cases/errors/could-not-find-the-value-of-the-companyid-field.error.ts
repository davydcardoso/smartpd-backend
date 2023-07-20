import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CouldNotFindTheValueOfTheCompanyIdFieldError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("Favor informe um 'companyid' valido");
    this.name = 'CouldNotFindTheValueOfTheCompanyIdFieldError';
  }
}
