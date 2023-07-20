import { Injectable } from '@nestjs/common/decorators';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyEntity } from '../domain/entity/companies/companies';
import { Document } from '../domain/entity/companies/document';
import { Email } from '../domain/entity/companies/email';
import { Name } from '../domain/entity/companies/name';
import { Status } from '../domain/entity/companies/status';
import { CompanyRepository } from '../infra/repositories/company.repository';
import { CompanyAccountIsNotActivedError } from './errors/company-account-is-not-actived.error';
import { CompanyIsNotExistsError } from './errors/company-is-not-exists.error';
import { UpdateCompanyDataRequestInvalidError } from './errors/update-company-data-request-invalid.error';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';

type UpdateCompanyDataUseCaseRequest = {
  userId: string;
  name: string;
  email: string;
  document: string;
};

type UpdateCompanyDataUseCaseResult = Either<Error, object>;

@Injectable()
export class UpdateCompanyDataUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly companiesRepository: CompanyRepository,
  ) {}

  async perform({
    userId,
    name,
    email,
    document,
  }: UpdateCompanyDataUseCaseRequest): Promise<UpdateCompanyDataUseCaseResult> {
    if (!name && !email && !document) {
      return left(new UpdateCompanyDataRequestInvalidError());
    }

    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const statusOrError = Status.create('ACTIVATED');
    const documentOrError = Document.create(document);

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

    const _document = documentOrError.value;

    const user = await this.usersRepository.getById(userId);

    if (!user) {
      return left(new UserAccountIsNotExistsError());
    }

    const company = await this.companiesRepository.getByDocument(
      _document.value,
    );

    if (!company) {
      return left(new CompanyIsNotExistsError());
    }

    if (!company.status) {
      return left(new CompanyAccountIsNotActivedError());
    }

    const companyOrError = CompanyEntity.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        document: documentOrError.value,
        status: statusOrError.value,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
      company.id,
    );

    if (companyOrError.isLeft()) {
      return left(companyOrError.value);
    }

    await this.companiesRepository.update(company.id, companyOrError.value);

    return right({ message: 'Dados alterados com sucesso' });
  }
}
