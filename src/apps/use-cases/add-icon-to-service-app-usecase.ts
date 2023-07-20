import { Injectable } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common/exceptions';

import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { Services } from '../domain/entity/services/services';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { ServicesRepository } from '../infra/repositories/services.repository';

import { ServiceNotFoundError } from './errors/service-not-found.error';
import { UserDoesNotHavePermissionForThisFunctionalityError } from './errors/user-does-not-have-permission-for-this-functionality.error';

interface JwtPayloadExtends extends JwtPayload {
  userId: string;
  companyId: string;
}

type AddIconToServiceAppUseCaseRequest = {
  token: string;
  serviceId: string;
  file: {
    size: number;
    path: string;
    encoding: string;
    mimetype: string;
    filename: string;
    fieldname: string;
    destination: string;
    originalname: string;
  };
};

type AddIconToServiceAppUseCaseResponse = Either<Error, object>;

@Injectable()
export class AddIconToServiceAppUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly servicesRepository: ServicesRepository,
    private readonly companiesRepository: CompanyRepository,
  ) {}

  async perform({
    file,
    token,
    serviceId,
  }: AddIconToServiceAppUseCaseRequest): Promise<AddIconToServiceAppUseCaseResponse> {
    const result = await new Promise<string | JwtPayload>((resolve, reject) => {
      verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          resolve('ERROR');
          return;
        }

        resolve(decoded);
      });
    });

    if (result === 'ERROR') {
      return left(
        new UnauthorizedException(
          'Você não tem permissão para acessar está funcionalidade',
        ),
      );
    }

    const { userId, companyId } = result as JwtPayloadExtends;

    if (!userId && !companyId) {
      return left(
        new UnauthorizedException(
          'Você não tem permissão para acessar está funcionalidade, token de acesso invalido, empresa e usuário não definidos',
        ),
      );
    }

    const user = await this.usersRepository.getById(userId);

    if (!user) {
      return left(
        new UnauthorizedException(
          'Você não tem permissão para acessar está funcionalidade, usuário não existe no sistema',
        ),
      );
    }

    const company = await this.companiesRepository.getById(companyId);

    if (!company) {
      throw new Error(
        'Você não tem permissão para acessar está funcionalidade, empresa não registrada no sistema ',
      );
    }

    if (company.status.value !== 'ACTIVATED') {
      return left(
        new UnauthorizedException(
          'Você não tem permissão para acessar está funcionalidade, o cadatro da entidade está desativado',
        ),
      );
    }

    const accessLevel = user.accessLevel.value;

    if (accessLevel !== 'ADMINISTRATOR' && accessLevel !== 'DEVELOPER') {
      return left(new UserDoesNotHavePermissionForThisFunctionalityError());
    }

    const service = await this.servicesRepository.getById(serviceId);

    if (!service) {
      return left(new ServiceNotFoundError());
    }

    const { filename } = file;
    const {
      name,
      serviceType,
      pathUrl,
      description,
      ambient,
      servicesStatus,
      createdAt,
    } = service;

    const serviceOrError = Services.create(
      {
        name,
        pathUrl,
        ambient,
        description,
        serviceType,
        servicesStatus,
        createdAt,
        updatedAt: new Date(),
        buttonIcon: filename,
      },
      service.id,
    );

    if (serviceOrError.isLeft()) {
      return left(serviceOrError.value);
    }

    await this.servicesRepository.update(service.id, serviceOrError.value);

    return right({});
  }
}
