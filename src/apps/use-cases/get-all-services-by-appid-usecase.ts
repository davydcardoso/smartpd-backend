import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { ServicesRepository } from '../infra/repositories/services.repository';
import { ServicesMapper } from '../mappers/services.mapper';
import { Services } from '@prisma/client';

type GetAllServicesByAppIdUseCaseRequest = {
  appId: string;
};

type GetAllServicesByAppIdUseCaseResponse = Either<Error, object>;

@Injectable()
export class GetAllServicesByAppIdUseCase implements UseCase {
  private readonly mapper: ServicesMapper;

  constructor(private readonly servicesRepository: ServicesRepository) {
    this.mapper = new ServicesMapper();
  }

  async perform({
    appId,
  }: GetAllServicesByAppIdUseCaseRequest): Promise<GetAllServicesByAppIdUseCaseResponse> {
    if (!appId) {
      return left(new Error('appId not informed'));
    }

    const servicesList: Services[] = [];

    const services = await this.servicesRepository.getServices(appId);

    for await (const service of services) {
      servicesList.push(await this.mapper.toPersistence(service));
    }

    return right(servicesList);
  }
}
