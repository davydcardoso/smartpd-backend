import { Injectable } from '@nestjs/common';

import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { Name } from '../domain/entity/companies/name';
import { Email } from '../domain/entity/companies/email';
import { Status } from '../domain/entity/companies/status';
import { SigUrl } from '../domain/entity/companies/sig-url';
import { Document } from '../domain/entity/companies/document';
import { CompanyEntity } from '../domain/entity/companies/companies';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from '../infra/repositories/company.repository';

import { AlreadyExistsCompanyAccountWithThisDocumentError } from './errors/already-exists-company-account-with-this-document.error';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';
import { AlreadyExistsCompanyAccountWithThisAddressEmailError } from './errors/already-exists-company-account-with-this-address-email.error';


type CreateCompanyUseCaseRequest = {
  userId: string;
  name: string;
  email: string;
  document: string;
  sigUrl?: string;
  responsibleEntity?: string;
};

type CreateCompanyUseCaseResponse = Either<Error, object>;

@Injectable()
export class CreateCompanyUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async perform({
    userId,
    name,
    email,
    document,
    sigUrl,
    responsibleEntity,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const statusOrError = Status.create('DEACTIVATED');
    const documentOrError = Document.create(document);

    let signUrlOrError: SigUrl;

    if (sigUrl) {
      const _signUrlOrError = SigUrl.create(sigUrl);

      if (_signUrlOrError.isLeft()) {
        return left(_signUrlOrError.value);
      }

      signUrlOrError = _signUrlOrError.value;
    }

    const user = await this.usersRepository.getById(userId);

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (documentOrError.isLeft()) {
      return left(documentOrError.value);
    }

    if (statusOrError.isLeft()) {
      return left(statusOrError.value);
    }

    const companyOrError = CompanyEntity.create({
      name: nameOrError.value,
      email: emailOrError.value,
      sigUrl: sigUrl ? signUrlOrError : undefined,
      status: statusOrError.value,
      document: documentOrError.value,
      responsibleEntity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (companyOrError.isLeft()) {
      return left(companyOrError.value);
    }

    const company = companyOrError.value;

    const alreadyExistsCompanyByEmail = await this.companyRepository.getByEmail(
      company.email.value,
    );

    if (alreadyExistsCompanyByEmail) {
      return left(new AlreadyExistsCompanyAccountWithThisAddressEmailError());
    }

    const alreadyExistsCompanyByDocument =
      await this.companyRepository.getByDocument(company.document.value);

    if (alreadyExistsCompanyByDocument) {
      return left(new AlreadyExistsCompanyAccountWithThisDocumentError());
    }

    await this.companyRepository.create(company);

    return right({});
  }
}
