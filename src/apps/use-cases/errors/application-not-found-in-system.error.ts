import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class ApplicationNotFoundInSystemError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Aplicativo não localizado no sistmea');
    this.name = 'ApplicationNotFoundInSystemError';
  }
}
