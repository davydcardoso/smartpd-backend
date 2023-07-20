import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';

import { COMPANY_ADMIN_ID, USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';

import { PrismaModule } from 'src/prisma/prisma.module';

import { AppsRepository } from '../infra/repositories/apps.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { ServicesRepository } from '../infra/repositories/services.repository';

import { AppsRepositoryInMemory } from '../infra/repositories/apps.repository.in-memory';
import { CompanyRepositoryInMemory } from 'src/companies/infra/repositories/company.repository.in-memory';
import { ServicesRepositoryInMemory } from '../infra/repositories/services.repository.in-memory';
import { AddServiceInAppCompanyUseCase } from './add-service-in-app-company';
import { ApplicationNotFoundInSystemError } from './errors/application-not-found-in-system.error';

describe('AddServiceInAppCompanyUseCase', () => {
  let usecase: AddServiceInAppCompanyUseCase;

  const SERVICE_ID = '4643a988-822d-4f46-9f76-30e5ee4f506f';
  const APPLICATION_ID = '4643a988-822d-4f46-9f76-30e5ee4f506f';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddServiceInAppCompanyUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: AppsRepository,
          useClass: AppsRepositoryInMemory,
        },
        {
          provide: ServicesRepository,
          useClass: ServicesRepositoryInMemory,
        },
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryInMemory,
        },
      ],
    }).compile();

    usecase = module.get<AddServiceInAppCompanyUseCase>(
      AddServiceInAppCompanyUseCase,
    );
  });

  it('Testing if usecase module ben defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should error if application not exists', async () => {
    const result = await usecase.perform({
      appId: randomUUID(),
      userId: USER_ADMIN_ID_1,
      companyId: COMPANY_ADMIN_ID,
      serviceId: randomUUID(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(
      new ApplicationNotFoundInSystemError(),
    );
  });

  it('should error if appId and service not exists', async () => {
    const result = await usecase.perform({
      appId: randomUUID(),
      companyId: COMPANY_ADMIN_ID,
      userId: USER_ADMIN_ID_1,
      serviceId: randomUUID(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new ApplicationNotFoundInSystemError());
  });

  it('should success if service has ben add in company application', async () => {
    const result = await usecase.perform({
      appId: APPLICATION_ID,
      userId: USER_ADMIN_ID_1,
      companyId: COMPANY_ADMIN_ID,
      serviceId: SERVICE_ID,
      
    });

    expect(result.isLeft()).toBe(false);
    expect(typeof result.value).toEqual('object');
  });
});
