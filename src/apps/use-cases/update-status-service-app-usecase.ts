import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { Status } from '../domain/entity/services/Status';
import { Services } from '../domain/entity/services/services';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { ServicesRepository } from '../infra/repositories/services.repository';

import { ServiceNotFoundError } from './errors/service-not-found.error';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';
import { Injectable } from '@nestjs/common';

type UpdateStatusServiceAppUseCaseRequest = {
  userId: string;
  status: string;
  serviceId: string;
};

type UpdateStatusServiceAppUseCaseResponse = Either<Error, object>;

@Injectable()
export class UpdateStatusServiceAppUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly servicesRepository: ServicesRepository,
  ) {}

  async perform({
    userId,
    status,
    serviceId,
  }: UpdateStatusServiceAppUseCaseRequest): Promise<UpdateStatusServiceAppUseCaseResponse> {
    const user = await this.usersRepository.getById(userId);

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    const service = await this.servicesRepository.getById(serviceId);

    if (!service) {
      return left(new ServiceNotFoundError());
    }

    const statusOrError = Status.create(status);

    if (statusOrError.isLeft()) {
      return left(statusOrError.value);
    }

    const {
      name,
      serviceType,
      pathUrl,
      ambient,
      buttonIcon,
      description,
      createdAt,
    } = service;

    const serviceOrError = Services.create({
      name,
      pathUrl,
      ambient,
      buttonIcon,
      description,
      serviceType,
      servicesStatus: statusOrError.value,
      createdAt,
      updatedAt: new Date(),
    });

    if (serviceOrError.isLeft()) {
      return left(serviceOrError.value);
    }

    await this.servicesRepository.update(service.id, serviceOrError.value);

    return right({
      message: 'Alteração de status do serviço realizado com sucesso',
    });
  }
}
