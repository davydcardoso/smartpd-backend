import { Injectable } from '@nestjs/common/decorators';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { Email } from '../domain/entity/users/email';
import { Password } from '../domain/entity/users/password';
import { User } from '../domain/entity/users/user.entity';
import { PasswordChangesRepository } from '../infra/repositories/password-changes.repository';
import { UserRepository } from '../infra/repositories/user.repository';
import { ExpiredPasswordChangeCodeError } from './errors/expired-password-change-code.error';
import { InvalidChangeCodeError } from './errors/invalid-chage-code.error';
import { NoPasswordChangePromptsError } from './errors/no-password-change-prompts.error';
import { PasswordAlreadyInUseError } from './errors/password-already-in-use.error';
import { RecoveryCodeOrInvalidPasswordChangeError } from './errors/recovery-code-or-invalid-password-change.error';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';

type AlterAccountPasswordUseCaseRequest = {
  code: string;
  email: string;
  newPassword: string;
};

type AlterAccountPasswordUseCaseResult = Either<Error, object>;

@Injectable()
export class AlterAccountPasswordUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly passwordChangesRepository: PasswordChangesRepository,
  ) {}

  async perform({
    code,
    email,
    newPassword,
  }: AlterAccountPasswordUseCaseRequest): Promise<AlterAccountPasswordUseCaseResult> {
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(newPassword);

    if (!code || code.trim().length < 5 || code.trim().length > 255) {
      return left(new InvalidChangeCodeError());
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const _email = emailOrError.value;

    const user = await this.usersRepository.getByEmail(_email.value);

    if (!user) {
      return left(new UserAccountIsNotExistsError());
    }

    const passwordChanges = await this.passwordChangesRepository.getByUserId(
      user.id,
    );

    if (!passwordChanges) {
      return left(new NoPasswordChangePromptsError());
    }

    const passwordChangeRequest =
      await this.passwordChangesRepository.getByCode(code);

    if (!passwordChangeRequest) {
      return left(new RecoveryCodeOrInvalidPasswordChangeError());
    }

    const currentDate = new Date();

    if (currentDate > passwordChangeRequest.expiresIn) {
      return left(new ExpiredPasswordChangeCodeError());
    }

    const passwordAlreadyInUse = await user.password.comparePassword(
      newPassword,
    );

    if (passwordAlreadyInUse) {
      return left(new PasswordAlreadyInUseError());
    }

    const userOrError = User.create(
      {
        name: user.name,
        document: user.document,
        email: user.email,
        accessLevel: user.accessLevel,
        birthDate: user.birthDate,
        companyId: user.companyId,
        emailConfirmed: user.emailConfirmed,
        motherName: user.motherName,
        telephone: user.telephone,
        password: passwordOrError.value,
        createdAt: user.createAt,
        updatedAt: new Date(),
      },
      user.id,
    );

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    await this.usersRepository.update(user.id, userOrError.value);

    return right({});
  }
}
