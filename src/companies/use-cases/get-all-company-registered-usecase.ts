import { Injectable } from '@nestjs/common';
import { Companies } from '@prisma/client';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyEntity } from '../domain/entity/companies/companies';
import { CompanyRepository } from '../infra/repositories/company.repository';
import { CompanyMapper } from '../mappers/company.mapper';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';

type GetAllCompanyRegisteredUseCaseRequest = {
  userId: string;
};

type GetAllCompanyRegisteredUseCaseResponse = Either<Error, object>;

@Injectable()
export class GetAllCompanyRegisteredUseCase implements UseCase {
  private companyMapper: CompanyMapper;

  constructor(
    private readonly usersRepository: UserRepository,
    private readonly companiesRepository: CompanyRepository,
  ) {
    this.companyMapper = new CompanyMapper();
  }

  async perform({
    userId,
  }: GetAllCompanyRegisteredUseCaseRequest): Promise<GetAllCompanyRegisteredUseCaseResponse> {
    const user = await this.usersRepository.getById(userId);
    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    const companies = await this.companiesRepository.getAll();

    const companyList: Companies[] = [];

    for await (const _company of companies) {
      if (_company.id !== user.companyId) {
        companyList.push(await this.companyMapper.toPersistence(_company));
      }
    }

    return right(companyList);
  }
}
