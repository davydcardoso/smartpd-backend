import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/core/domain/use-case';
import { Either, right } from 'src/core/logic/Either';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from '../infra/repositories/company.repository';
import { CompanyMapper } from '../mappers/company.mapper';

type GetCompanyDataUseCaseRequest = {
  userId: string;
};

type GetCompanyDataUseCaseResult = Either<Error, object>;

@Injectable()
export class GetCompanyDataUseCase implements UseCase {
  private companyMapper: CompanyMapper;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {
    this.companyMapper = new CompanyMapper();
  }

  async perform({
    userId,
  }: GetCompanyDataUseCaseRequest): Promise<GetCompanyDataUseCaseResult> {
    const user = await this.userRepository.getById(userId);
    const { companyId } = user;

    const company = await this.companyRepository.getById(companyId);

    return right({ ...(await this.companyMapper.toPersistence(company)) });
  }
}
