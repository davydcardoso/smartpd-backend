import { Injectable } from '@nestjs/common/decorators';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { Document } from '../domain/entity/users/document';
import { Email } from '../domain/entity/users/email';
import { Name } from '../domain/entity/users/name';
import { Password } from '../domain/entity/users/password';
import { Telephone } from '../domain/entity/users/telephone';
import { User } from '../domain/entity/users/user.entity';
import { UserRepository } from '../infra/repositories/user.repository';
import { OldPasswordEnteredIsNotCorrectError } from './errors/old-password-entered-is-not-correct.error';
import { PasswordsDoNotMatchError } from './errors/password-do-not-match.error';
import { PasswordInformedNotCorrectError } from './errors/password-informed-not-correct.error';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';
import { UserIdNotDefinedError } from './errors/userid-is-not-defined.error';

type UpdateAccountUseCaseRequest = {
  userId: string;
  name: string;
  email: string;
  document: string;
  password: string;
  birthDate: string;
  telephone: string;
  motherName: string;
  newPassword: string;
  confirmPassword?: string;
};

type UpdateAccountUseCaseResponse = Either<
  Error,
  UpdateAccountUseCaseResponseProps
>;

type UpdateAccountUseCaseResponseProps = {};

@Injectable()
export class UpdateAccountUseCase implements UseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  async perform({
    userId,
    name,
    email,
    document,
    password,
    telephone,
    birthDate,
    motherName,
    newPassword,
    confirmPassword,
  }: UpdateAccountUseCaseRequest): Promise<UpdateAccountUseCaseResponse> {
    if (!userId || userId.trim().length < 5 || userId.trim().length > 255) {
      return left(new UserIdNotDefinedError());
    }

    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const documentOrError = Document.create(document);
    const passwordOrError = Password.create(password);
    const telephoneOrError = Telephone.create(telephone);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (documentOrError.isLeft()) {
      return left(documentOrError.value);
    }

    if (telephoneOrError.isLeft()) {
      return left(telephoneOrError.value);
    }

    const user = await this.usersRepository.getById(userId);

    if (!user) {
      return left(new UserAccountIsNotExistsError());
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return left(new PasswordsDoNotMatchError());
      }

      if (!user.password.comparePassword(password)) {
        return left(new OldPasswordEnteredIsNotCorrectError());
      }

      const _newPasswordOrError = Password.create(newPassword);

      if (_newPasswordOrError.isLeft()) {
        return left(new OldPasswordEnteredIsNotCorrectError());
      }

      const _updatedUserDataOrError = User.create(
        {
          name: nameOrError.value,
          email: emailOrError.value,
          document: documentOrError.value,
          password: _newPasswordOrError.value,
          telephone: telephoneOrError.value,
          birthDate: new Date(birthDate),
          companyId: user.companyId,
          accessLevel: user.accessLevel,
          motherName,
          emailConfirmed: false,
          updatedAt: new Date(),
        },
        user.id,
      );

      if (_updatedUserDataOrError.isLeft()) {
        return left(_updatedUserDataOrError.value);
      }

      await this.usersRepository.update(user.id, _updatedUserDataOrError.value);
      return right({});
    }

    const updatedAccount = User.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        document: user.document,
        accessLevel: user.accessLevel,
        telephone: telephoneOrError.value,
        birthDate: new Date(birthDate),
        password: passwordOrError.value,
        companyId: user.companyId,
        motherName,
        emailConfirmed: false,
        updatedAt: new Date(),
      },
      user.id,
    );

    if (updatedAccount.isLeft()) {
      return left(updatedAccount.value);
    }

    await this.usersRepository.update(user.id, updatedAccount.value);
    return right({});
  }
}
