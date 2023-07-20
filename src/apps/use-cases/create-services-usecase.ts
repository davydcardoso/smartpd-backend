import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { Services } from '../domain/entity/services/services';
import { ServicesRepository } from '../infra/repositories/services.repository';

import { Name } from '../domain/entity/services/name';
import { Status } from '../domain/entity/services/status';
import { Ambient } from '../domain/entity/services/ambient';
import { PathUrl } from '../domain/entity/services/path-url';
import { Description } from '../domain/entity/services/description';

import { AlreadyExistsServicesWithPathUrlError } from './errors/already-exists-service-with-pathurl.error';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';
import { ServiceType } from '../domain/entity/services/service-type';

type CreateServiceUseCaseRequest = {
  userId: string;
  name: string;
  type: string;
  status: string;
  pathUrl: string;
  ambient: string;
  buttonIcon?: string;
  description?: string;
  mobileModule?: string;
};

type CreateServiceUseCaseResponse = Either<Error, object>;

@Injectable()
export class CreateServiceUseCase implements UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly servicesRepository: ServicesRepository,
  ) {}

  async perform({
    userId,
    name,
    type,
    status,
    pathUrl,
    ambient,
    buttonIcon,
    description,
    mobileModule,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const nameOrError = Name.create(name);
    const statusOrError = Status.create(status);
    const pathUrlOrError = PathUrl.create(pathUrl);
    const ambientOrError = Ambient.create(ambient);
    const descriptionOrError = Description.create(description);
    const servicesTypeOrError = ServiceType.create(type);

    const user = await this.userRepository.getById(userId);

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (pathUrlOrError.isLeft()) {
      return left(pathUrlOrError.value);
    }

    if (descriptionOrError.isLeft()) {
      return left(descriptionOrError.value);
    }

    if (statusOrError.isLeft()) {
      return left(statusOrError.value);
    }

    if (ambientOrError.isLeft()) {
      return left(ambientOrError.value);
    }

    if (servicesTypeOrError.isLeft()) {
      return left(servicesTypeOrError.value);
    }

    const serviceOrError = Services.create({
      name: nameOrError.value,
      ambient: ambientOrError.value,
      pathUrl: pathUrlOrError.value,
      serviceType: servicesTypeOrError.value,
      description: descriptionOrError.value,
      servicesStatus: statusOrError.value,
      buttonIcon,
      moduleMobile: mobileModule,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (serviceOrError.isLeft()) {
      return left(serviceOrError.value);
    }

    const serviceAlreadyExists = await this.servicesRepository.getByPathUrl(
      pathUrl,
    );

    if (serviceAlreadyExists) {
      return left(new AlreadyExistsServicesWithPathUrlError());
    }

    const services = serviceOrError.value;

    await this.servicesRepository.create(services);

    return right({ serviceId: services.id });
  }
}
