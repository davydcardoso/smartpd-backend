import { Injectable } from '@nestjs/common';

import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { AppsRepository } from '../infra/repositories/apps.repository';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';

import { Apps } from '../domain/entity/apps/apps';
import { AppsMapper } from '../mappers/apps.mapper';

import { Name } from '../domain/entity/apps/name';
import { Status } from '../domain/entity/apps/status';
import { Version } from '../domain/entity/apps/version';
import { CurrentPlan } from '../domain/entity/apps/current-plan';

import { CompanyAccountIsNotActivedError } from './errors/company-account-is-not-actived.error';
import { CompanyAccountIsNotExistsInSystemError } from './errors/company-account-is-not-exists-in-system.error';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';

type CreateAppUseCaseRequest = {
  userId: string;
  name: string;
  status: string;
  version: string;
  companyId: string;
  currentPlan: string;
  publicationDate?: Date;
  availableVersions: string;
};

type CreateAppUseCaseResponse = Either<Error, object>;

@Injectable()
export class CreateAppUseCase implements UseCase {
  private mapper: AppsMapper;

  constructor(
    private readonly appsRepository: AppsRepository,
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {
    this.mapper = new AppsMapper();
  }

  async perform({
    userId,
    name,
    status,
    version,
    companyId,
    currentPlan,
    publicationDate,
    availableVersions,
  }: CreateAppUseCaseRequest): Promise<CreateAppUseCaseResponse> {
    const user = await this.userRepository.getById(userId);

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    const company = await this.companyRepository.getById(companyId);

    if (!company) {
      return left(new CompanyAccountIsNotExistsInSystemError());
    }

    if (company.status.value !== 'ACTIVATED') {
      return left(new CompanyAccountIsNotActivedError());
    }

    const nameOrError = Name.create(name);
    const statusOrError = Status.create(status);
    const versionOrError = Version.create(version);
    const currentPlanOrError = CurrentPlan.create(currentPlan);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (statusOrError.isLeft()) {
      return left(statusOrError.value);
    }

    if (versionOrError.isLeft()) {
      return left(versionOrError.value);
    }

    if (currentPlanOrError.isLeft()) {
      return left(currentPlanOrError.value);
    }

    const appOrError = Apps.create({
      name: nameOrError.value,
      status: statusOrError.value,
      version: versionOrError.value,
      currentPlan: currentPlanOrError.value,
      companyId,
      publicationDate,
      availableVersions,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (appOrError.isLeft()) {
      return left(appOrError.value);
    }

    await this.appsRepository.create(appOrError.value);

    const app = await this.mapper.toPersistence(appOrError.value);

    return right({
      message: 'Aplicativo criado com sucesso',
      app: { ...app },
    });
  }
}
