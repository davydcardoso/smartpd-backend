import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull/dist/decorators';

import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { PasswordChanges } from '../domain/entity/password-changes/password-changes';

import { UserRepository } from '../infra/repositories/user.repository';
import { PasswordChangesRepository } from '../infra/repositories/password-changes.repository';

import { UserIdNotDefinedError } from './errors/userid-is-not-defined.error';
import { UserEmailNotConfirmedError } from './errors/user-email-not-confirmed.error';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';
import { PasswordChangeAlreadyRequestedError } from './errors/password-change-already-requested.error';

type UpdatePasswordAccountUseCaseRequest = {
  userId: string;
};

type UpdatePasswordAccountUseCaseResponse = Either<Error, object>;

@Injectable()
export class UpdatePasswordAccountUseCase implements UseCase {
  constructor(
    @InjectQueue('send-email:queue') private emailQueue: Queue,
    private readonly userRepository: UserRepository,
    private readonly passwordChangesRepository: PasswordChangesRepository,
  ) {}

  async perform({
    userId,
  }: UpdatePasswordAccountUseCaseRequest): Promise<UpdatePasswordAccountUseCaseResponse> {
    if (!userId || userId.trim().length < 5 || userId.trim().length > 255) {
      return left(new UserIdNotDefinedError());
    }

    const user = await this.userRepository.getById(userId);

    if (!user) {
      return left(new UserAccountIsNotExistsError());
    }

    if (!user.emailConfirmed) {
      return left(new UserEmailNotConfirmedError());
    }

    const changeRequests = await this.passwordChangesRepository.getByUserId(
      userId,
    );

    if (changeRequests && changeRequests.length >= 3) {
      return left(new PasswordChangeAlreadyRequestedError());
    }

    let code: string = '';
    const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
    const charactersLength = characters.length;

    for (let i = 0; i < 10; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const expiresIn = new Date();
    expiresIn.setMinutes(+10);

    const passwordChangesOrError = PasswordChanges.create({
      code: code.toUpperCase(),
      userId,
      expiresIn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (passwordChangesOrError.isLeft()) {
      return left(passwordChangesOrError.value);
    }

    const passwordChanges = passwordChangesOrError.value;

    await this.passwordChangesRepository.create(passwordChanges);

    if (process.env.NODE_ENV != 'test') {
      await this.emailQueue.add({ id: passwordChanges.id });
    }

    return right({
      message: 'Alteração solicitada com sucesso, cheque seu email!',
    });
  }
}
