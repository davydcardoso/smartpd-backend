import { PrismaModule } from 'src/prisma/prisma.module';
import { Test, TestingModule } from '@nestjs/testing';

import { UpdateCompanyDataUseCase } from './udpate-company-data-usecase';

import { CompanyRepository } from '../infra/repositories/company.repository';
import { CompanyRepositoryInMemory } from '../infra/repositories/company.repository.in-memory';

import { CompanyIsNotExistsError } from './errors/company-is-not-exists.error';
import { UpdateCompanyDataRequestInvalidError } from './errors/update-company-data-request-invalid.error';
import { USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryInMemory } from 'src/users/infra/repositories/user.repository.in-memory';

describe('UpdateCompanyDataUseCase', () => {
  let usecase: UpdateCompanyDataUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateCompanyDataUseCase],
      imports: [],
      providers: [
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

    usecase = module.get<UpdateCompanyDataUseCase>(UpdateCompanyDataUseCase);
  });

  it('Testing module is defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should error if UpdateCompanyDataUseCase request is invalid', async () => {
    const result = await usecase.perform({ userId: USER_ADMIN_ID_1 } as {
      userId: string;
      name: string;
      email: string;
      document: string;
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(
      new UpdateCompanyDataRequestInvalidError(),
    );
  });

  it('should error if UpdateCompanyDataUseCase company not exists', async () => {
    const result = await usecase.perform({
      userId: USER_ADMIN_ID_1,
      document: '00.000.000/0001-16',
      name: 'Empresa de testes',
      email: 'email@test.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new CompanyIsNotExistsError());
  });

  it('should success if UpdateCompanyDataUseCase company data udpated', async () => {
    const result = await usecase.perform({
      userId: USER_ADMIN_ID_1,
      name: 'Prodata Informatica',
      email: 'dev@prodata.com',
      document: '00.000.000/0001-12',
    });

    expect(result.isRight()).toBe(true);
  });
});
