import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { ServicesRepository } from '../infra/repositories/services.repository';
import { Apps } from '../domain/entity/apps/apps';
import { AppsRepository } from '../infra/repositories/apps.repository';
import { ServicesMapper } from '../mappers/services.mapper';
import { AppsMapper } from '../mappers/apps.mapper';
import { AppsServices, Services } from '@prisma/client';

type GetAllServicesAppsUseCaseRequest = {
  appsid: string;
};

type GetAllServicesAppsUseCaseResponse = Either<Error, object>;

type ResultPrismaConsult = (Apps & {
  AppServices: (AppsServices & {
    services: Services;
  })[];
})[];

@Injectable()
export class GetAllServicesAppsUseCase implements UseCase {
  private appsMapper: AppsMapper;
  private serviceMapper: ServicesMapper;

  constructor(
    private readonly appsRepository: AppsRepository,
    private readonly servicesRepository: ServicesRepository,
  ) {
    this.appsMapper = new AppsMapper();
    this.serviceMapper = new ServicesMapper();
  }

  async perform({
    appsid,
  }: GetAllServicesAppsUseCaseRequest): Promise<GetAllServicesAppsUseCaseResponse> {
    const result: ResultPrismaConsult =
      await this.servicesRepository.getServiceForAppId(appsid);

    return right(result);
  }
}
