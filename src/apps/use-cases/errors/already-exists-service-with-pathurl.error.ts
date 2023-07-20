import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class AlreadyExistsServicesWithPathUrlError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Já exists um serviço com essa url cadastrado em nosso sistema');
    this.name = 'AlreadyExistsServicesWithPathUrlError';
  }
}
