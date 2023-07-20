import { Services } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { ServicesMapper } from '../mappers/services.mapper';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { ServicesRepository } from '../infra/repositories/services.repository';

import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';

type GetAllServicesAppUseCaseRequest = {
  userId: string;
};

type GetAllServicesAppUseCaseResponse = Either<Error, object>;

@Injectable()
export class GetAllServicesAppUseCase implements UseCase {
  private servicesMapper: ServicesMapper;

  constructor(
    private readonly usersRepository: UserRepository,
    private readonly servicesRepository: ServicesRepository,
  ) {
    this.servicesMapper = new ServicesMapper();
  }

  async perform({
    userId,
  }: GetAllServicesAppUseCaseRequest): Promise<GetAllServicesAppUseCaseResponse> {
    const user = await this.usersRepository.getById(userId);

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'DEVELOPER' && accessLevel !== 'ADMINISTRATOR') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    const services = await this.servicesRepository.getAll();

    const serviceList: Services[] = [];

    if (!services || services.length <= 0) {
      return right([]);
    }

    for await (const service of services) {
      try {
        serviceList.push(await this.servicesMapper.toPersistence(service));
      } catch (err) {
        console.log(this.constructor, err.message);
      }
    }

    return right(serviceList);
  }
}
