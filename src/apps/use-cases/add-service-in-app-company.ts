import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { AppsRepository } from '../infra/repositories/apps.repository';
import { ServicesRepository } from '../infra/repositories/services.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { ApplicationNotFoundInSystemError } from './errors/application-not-found-in-system.error';
import { ServiceNotFoundInSystemError } from './errors/service-not-found-in-system.error';
import { CompanyAccountIsNotExistsInSystemError } from './errors/company-account-is-not-exists-in-system.error';

type AddServiceInAppCompanyUseCaseRequest = {
  userId: string;
  companyId: string;

  appId: string;
  serviceId: string;
};

type AddServiceInAppCompanyUseCaseResponse = Either<Error, object>;

@Injectable()
export class AddServiceInAppCompanyUseCase implements UseCase {
  constructor(
    private readonly applicationRepository: AppsRepository,
    private readonly servicesRepository: ServicesRepository,
    private readonly companiesRepository: CompanyRepository,
  ) {}

  async perform({
    userId,
    companyId,
    appId,
    serviceId,
  }: AddServiceInAppCompanyUseCaseRequest): Promise<AddServiceInAppCompanyUseCaseResponse> {
    if (!appId || !serviceId) {
      return left(
        new Error('Requisição invalida, favor confira os dados informado'),
      );
    }

    const app = await this.applicationRepository.getById(appId);
    const service = await this.servicesRepository.getById(serviceId);

    if (!app) {
      return left(new ApplicationNotFoundInSystemError());
    }

    if (!service) {
      return left(new ServiceNotFoundInSystemError());
    }

    const comapny = await this.companiesRepository.getById(companyId);

    if (!comapny) {
      return left(new CompanyAccountIsNotExistsInSystemError());
    }

    await this.applicationRepository.addService(app.id, service.id);

    return right({});
  }
}
