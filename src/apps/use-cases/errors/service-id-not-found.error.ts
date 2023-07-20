import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class ServiceIdNotfoundError extends Error implements UseCaseError {
  constructor() {
    super('ServiceId não informado na requisição');
    this.name = 'ServiceIdNotfoundError';
  }
}
