import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class ServiceNotFoundInSystemError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Serviço não existe em nosso sistema');
    this.name = 'ServiceNotFountInSystemError';
  }
}
