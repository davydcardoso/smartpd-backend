import { Apps } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { Either, left, right } from 'src/core/logic/Either';

import { UseCase } from 'src/core/domain/use-case';

import { AppsMapper } from '../mappers/apps.mapper';

import { AppsRepository } from '../infra/repositories/apps.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';

import { CompanyNotExistsError } from 'src/users/use-cases/errors/company-not-exists.error';

type GetAllAppsUseCaseRequest = {
  userId: string;
  companyId: string;
};

type GetAllAppsUseCaseResponse = Either<Error, object>;

@Injectable()
export class GetAllAppsUseCase implements UseCase {
  private appMapper: AppsMapper;

  constructor(
    private readonly appsRepository: AppsRepository,
    private readonly companiesRepository: CompanyRepository,
  ) {
    this.appMapper = new AppsMapper();
  }

  async perform({
    companyId,
  }: GetAllAppsUseCaseRequest): Promise<GetAllAppsUseCaseResponse> {
    const appsList: Apps[] = [];

    const company = await this.companiesRepository.getById(companyId);

    if (!company) {
      return left(new CompanyNotExistsError());
    }

    const apps = await this.appsRepository.getAll();

    for await (const app of apps) {
      appsList.push(await this.appMapper.toPersistence(app));
    }

    return right(appsList);
  }
}
