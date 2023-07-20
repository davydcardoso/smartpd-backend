import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from 'src/prisma/prisma.module';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from '../infra/repositories/company.repository';

import { UserRepositoryInMemory } from 'src/users/infra/repositories/user.repository.in-memory';
import { CompanyRepositoryInMemory } from '../infra/repositories/company.repository.in-memory';
import { DeleteCompanyAccountUseCase } from './delete-company-account-usecase';

describe('DeleteCompanyAccountUseCase', () => {
  let usecase: DeleteCompanyAccountUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteCompanyAccountUseCase],
      imports: [PrismaModule],
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

    usecase = module.get<DeleteCompanyAccountUseCase>(
      DeleteCompanyAccountUseCase,
    );
  });

  it('Testing with class has ben constructed', () => {
    expect(usecase).toBeDefined();
  });
});
