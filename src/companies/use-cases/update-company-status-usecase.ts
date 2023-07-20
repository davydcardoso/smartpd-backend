import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyEntity } from '../domain/entity/companies/companies';
import { Status } from '../domain/entity/companies/status';
import { CompanyRepository } from '../infra/repositories/company.repository';
import { ItIsNotPossibleToChangeTheStatusOfThisCustomerError } from './errors/it-is-not-possible-to-change-the-status-of-this-customer.error';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';

type UpdateCompanyStatusUseCaseRequest = {
  userId: string;
  status: string;
  customerId: string;
};

type UpdateCompanyStatusUseCaseResponse = Either<Error, object>;

@Injectable()
export class UpdateCompanyStatusUseCase implements UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async perform({
    userId,
    status,
    customerId,
  }: UpdateCompanyStatusUseCaseRequest): Promise<UpdateCompanyStatusUseCaseResponse> {
    const user = await this.userRepository.getById(userId);

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    const company = await this.companyRepository.getById(customerId);

    // const _status = company.status;

    // if (_status.value == 'REMOVED' || _status.value == 'EXCLUDED') {
    //   return left(new ItIsNotPossibleToChangeTheStatusOfThisCustomerError());
    // }

    const statusOrError = Status.create(status);

    if (statusOrError.isLeft()) {
      return left(statusOrError.value);
    }

    const { name, email, document, sigUrl, responsibleEntity, createdAt } =
      company;

    const companyOrError = CompanyEntity.create(
      {
        name,
        email,
        document,
        sigUrl,
        status: statusOrError.value,
        responsibleEntity,
        createdAt,
        updatedAt: new Date(),
      },
      company.id,
    );

    if (companyOrError.isLeft()) {
      return left(companyOrError.value);
    }

    await this.companyRepository.update(company.id, companyOrError.value);

    return right({ message: 'Alteração realizada com sucesso!' });
  }
}
