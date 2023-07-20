import { Mapper } from 'src/core/domain/mapper';

import {
  Services,
  ServicesAmbient,
  ServicesStatus,
  ServiceType as Type,
} from '@prisma/client';

import { Services as ServicesEntity } from '../domain/entity/services/services';

import { Name } from '../domain/entity/services/name';
import { Status } from '../domain/entity/services/status';
import { Ambient } from '../domain/entity/services/ambient';
import { PathUrl } from '../domain/entity/services/path-url';
import { ServiceType } from '../domain/entity/services/service-type';
import { Description } from '../domain/entity/services/description';

export class ServicesMapper extends Mapper<ServicesEntity, Services> {
  toDomain(raw: Services): ServicesEntity {
    const nameOrError = Name.create(raw.name);
    const statusOrError = Status.create(raw.servicesStatus);
    const pathUrlOrError = PathUrl.create(raw.pathUrl);
    const ambientOrError = Ambient.create(raw.ambient);
    const descriptionOrError = Description.create(raw.description);
    const servicesTypeOrError = ServiceType.create(raw.serviceType);

    if (nameOrError.isLeft()) {
      throw new Error('Nome do serviço invalido');
    }

    if (pathUrlOrError.isLeft()) {
      throw new Error('Endpoint do serviço invalido');
    }

    if (descriptionOrError.isLeft()) {
      throw new Error('Descrição do serviço invalida');
    }

    if (statusOrError.isLeft()) {
      throw new Error('Status do serviço invalida');
    }

    if (ambientOrError.isLeft()) {
      throw new Error('Ambiente do serviço invalida');
    }

    if (servicesTypeOrError.isLeft()) {
      throw new Error('Type de serviço invalido');
    }

    const appServiceOrError = ServicesEntity.create(
      {
        name: nameOrError.value,
        pathUrl: pathUrlOrError.value,
        ambient: ambientOrError.value,
        description: descriptionOrError.value,
        serviceType: servicesTypeOrError.value,
        servicesStatus: statusOrError.value,
        moduleMobile: raw.mobileModule || null,
        buttonIcon: raw.buttonIcon,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );

    if (appServiceOrError.isLeft()) {
      return null;
    }

    return appServiceOrError.value;
  }

  async toPersistence(raw: ServicesEntity): Promise<Services> {
    return {
      id: raw.id,
      name: raw.name.value,
      pathUrl: raw.pathUrl.value,
      description: raw.description.value,
      buttonIcon: raw.buttonIcon,
      mobileModule: raw.moduleMobile || null,
      serviceType: Type[raw.serviceType.value],
      ambient: ServicesAmbient[raw.ambient.value],
      servicesStatus: ServicesStatus[raw.servicesStatus.value],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
