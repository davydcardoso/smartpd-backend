import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class NoPasswordChangePromptsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Nenhuma solicitação para alteração de senha');
    this.name = 'NoPasswordChangePromptsError';
  }
}
