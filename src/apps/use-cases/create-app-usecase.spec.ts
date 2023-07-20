import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { CompanyRepositoryInMemory } from 'src/companies/infra/repositories/company.repository.in-memory';
import { COMPANY_ADMIN_ID, USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryInMemory } from 'src/users/infra/repositories/user.repository.in-memory';
import { InvalidAppCurrentPlanError } from '../domain/errors/invalid-app-current-plan.error';
import { InvalidAppNameError } from '../domain/errors/invalid-app-name.error';
import { InvalidAppStatusError } from '../domain/errors/invalid-app-status.error';
import { AppsRepository } from '../infra/repositories/apps.repository';
import { AppsRepositoryInMemory } from '../infra/repositories/apps.repository.in-memory';
import { CreateAppUseCase } from './create-app-usecase';

describe('CreateAppUseCase', () => {
  let usecase: CreateAppUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAppUseCase],
      providers: [
        {
          provide: AppsRepository,
          useClass: AppsRepositoryInMemory,
        },
        {
          provide: UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryInMemory,
        },
      ],
    }).compile();

    usecase = module.get<CreateAppUseCase>(CreateAppUseCase);
  });

  const data = {
    userId: USER_ADMIN_ID_1,
    name: 'SmartPD Prodata',
    status: 'NOT_PUBLISHED',
    version: '0.0.0.2',
    companyId: COMPANY_ADMIN_ID,
    currentPlan: 'LITE',
    publicationDate: new Date(),
    availableVersions: '0.0.0.0.1',
  };

  it('should success if object has bem created at', () => {
    expect(usecase).toBeDefined();
  });

  it('should error if CreateAppUseCase request name is invalid', async () => {
    const result = await usecase.perform({ ...data, name: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new InvalidAppNameError());
  });

  it('should error if CreateAppUseCase request status is invalid', async () => {
    const result = await usecase.perform({ ...data, status: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new InvalidAppStatusError());
  });

  it('should error if CreateAppUseCase request CurrentPlan is invalid', async () => {
    const result = await usecase.perform({ ...data, currentPlan: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new InvalidAppCurrentPlanError());
  });

  it('should success if CreateAppUseCase all params request is valid', async () => {
    const result = await usecase.perform({ ...data });

    expect(result.isRight()).toBe(true);
  });
});
