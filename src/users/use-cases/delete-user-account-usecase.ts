import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { UserRepository } from '../infra/repositories/user.repository';

import { UserAccountNotExistsError } from 'src/auth/errors/user-account-not-exists.error';
import { InvalidUserIdNotInformedError } from './errors/invalid-userid-not-informed.error';
import { Injectable } from '@nestjs/common/decorators';

type DeleteUserAccountUseCaseRequest = {
  userId: string;
};

type DeleteUserAccountUseCaseResponse = Either<Error, object>;

@Injectable()
export class DeleteUserAccountUseCase implements UseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async perform({
    userId,
  }: DeleteUserAccountUseCaseRequest): Promise<DeleteUserAccountUseCaseResponse> {
    if (!userId || userId.trim().length < 5 || userId.trim().length > 255) {
      return left(new InvalidUserIdNotInformedError());
    }

    const user = await this.userRepository.getById(userId);

    if (!user) {
      return left(new UserAccountNotExistsError());
    }

    await this.userRepository.delete(user.id);

    return right({});
  }
}
