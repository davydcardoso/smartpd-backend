import { Injectable } from '@nestjs/common';

import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { ServicesRepository } from '../infra/repositories/services.repository';

import { ServiceIdNotfoundError } from './errors/service-id-not-found.error';
import { ServiceNotFoundInSystemError } from './errors/service-not-found-in-system.error';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';

type DeleteServiceAppUseCaseRequest = {
  userId: string;
  serviceId: string;
};

type DeleteServiceAppUseCaseResponse = Either<Error, object>;

@Injectable()
export class DeleteServiceAppUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly servicesRepository: ServicesRepository,
  ) {}

  async perform({
    userId,
    serviceId,
  }: DeleteServiceAppUseCaseRequest): Promise<DeleteServiceAppUseCaseResponse> {
    const user = await this.usersRepository.getById(userId);

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    if (
      !serviceId ||
      serviceId.trim().length < 5 ||
      serviceId.trim().length > 255
    ) {
      return left(new ServiceIdNotfoundError());
    }

    const service = await this.servicesRepository.getById(serviceId);

    if (!service) {
      return left(new ServiceNotFoundInSystemError());
    }

    await this.servicesRepository.delete(service.id);

    return right({ message: 'Serviço excluido com sucesso' });
  }
}
