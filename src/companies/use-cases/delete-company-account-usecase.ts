import { UseCase } from 'src/core/domain/use-case';

import { Either, left, right } from 'src/core/logic/Either';

import { Status } from '../domain/entity/companies/status';

import { CompanyEntity } from '../domain/entity/companies/companies';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from '../infra/repositories/company.repository';

import { CouldNotFindTheValueOfTheCompanyIdFieldError } from './errors/could-not-find-the-value-of-the-companyid-field.error';
import { TheCompanyRegistrationIsAlreadyDisabledError } from './errors/the-company-reistration-is-already-disabled.error';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';
import { Injectable } from '@nestjs/common';

type DeleteCompanyAccountUseCaseRequest = {
  userId: string;
  companyId: string;
};

type DeleteCompanyAccountUseCaseResponse = Either<Error, object>;

@Injectable()
export class DeleteCompanyAccountUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async perform({
    userId,
    companyId,
  }: DeleteCompanyAccountUseCaseRequest): Promise<DeleteCompanyAccountUseCaseResponse> {
    const user = await this.usersRepository.getById(userId);

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    console.log(companyId);

    if (!companyId || companyId == undefined) {
      return left(new CouldNotFindTheValueOfTheCompanyIdFieldError());
    }

    const company = await this.companyRepository.getById(companyId);

    if (company.status.value == 'EXCLUDED') {
      return left(new TheCompanyRegistrationIsAlreadyDisabledError());
    }

    const statusOrError = Status.create('EXCLUDED').value as Status;

    const { name, email, sigUrl, document, responsibleEntity, createdAt } =
      company;

    const companyOrError = CompanyEntity.create(
      {
        name,
        email,
        sigUrl,
        document,
        createdAt,
        responsibleEntity,
        status: statusOrError,
        updatedAt: new Date(),
      },
      company.id,
    );

    if (companyOrError.isLeft()) {
      return left(companyOrError.value);
    }

    const companyUpdated = companyOrError.value;

    await this.companyRepository.update(companyUpdated.id, companyUpdated);

    return right({
      message: 'O cadastro deste cliente foi desabilitado com sucesso',
    });
  }
}
