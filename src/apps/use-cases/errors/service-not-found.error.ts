import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class ServiceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Serviço não foi encontrado em nosso sistema');
    this.name = 'ServiceNotFountError';
  }
}
