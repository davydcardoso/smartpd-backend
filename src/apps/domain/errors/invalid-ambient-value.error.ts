import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidAmbientValueError extends Error implements DomainError {
  constructor() {
    super('Ambiente informado para o serviço está invalido!');
    this.name = 'InvalidAmbientValueError';
  }
}
