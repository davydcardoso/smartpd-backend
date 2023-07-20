import { UseCase } from 'src/core/domain/use-case';
import { Either } from 'src/core/logic/Either';

type ValidateLoginUserUseCaseRequest = {};

type ValidateLoginUserUseCaseResponse = Either<Error, object>;

export class ValidateLoginUserUseCase implements UseCase {
  async perform({}: ValidateLoginUserUseCaseRequest): Promise<ValidateLoginUserUseCaseResponse> {
    throw new Error('Method not implemented.');
  }
}
