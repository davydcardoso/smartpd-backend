import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserUseCase } from './create-user-usecase';

import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from '../infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { UserRepositoryInMemory } from '../infra/repositories/user.repository.in-memory';
import { CompanyRepositoryPrisma } from 'src/companies/infra/repositories/company.repository.prisma';

import { InvalidNameUserError } from '../domain/entity/errors/invalid-name-user.error';
import { CompanyNotExistsError } from './errors/company-not-exists.error';
import { CompanyIdNotFoundError } from './errors/company-id-not-found.error';
import { InvalidUserDocumentError } from '../domain/entity/errors/invalid-user-document.error';
import { InvalidTelephoneValueError } from '../domain/entity/errors/invalid-telephone-value.error';
import { InvalidMotherNameValueError } from './errors/invalid-mother-name-value.error';
import { InvalidBirthDateValueError } from './errors/invalid-birth-date-value.error';
import { COMPANY_ADMIN_ID } from 'src/prisma/seed.constants';

describe('CreateUserUseCase', () => {
  let usecase: CreateUserUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryPrisma,
        },
      ],
    }).compile();

    usecase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  const data = {
    name: 'Prodata cliente teste',
    email: 'cliente@mail.com',
    password: 'Dv@_7469',
    document: '000.000.000-11',
    accessLevel: 'CLIENT',
    birthDate: '1997-03-20',
    telephone: '62983055581',
    motherName: 'Mae de teste',
    companyId: COMPANY_ADMIN_ID,
  };

  it('Create User: should error if CreateUserUseCase request name invalid and isLeft value is true', async () => {
    const resultTest1 = await usecase.perform({ ...data, name: '' });
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(new InvalidNameUserError());

    const resultTest2 = await usecase.perform({ ...data, name: 'PD' });
    expect(resultTest2.isLeft()).toBe(true);
    expect(resultTest2.value as Error).toEqual(new InvalidNameUserError());
  });

  it('Create User: should error if CreateUserUseCase request email invalid and isLeft value is true', async () => {
    const resultTest1 = await usecase.perform({ ...data, email: '' });
    expect(resultTest1.isLeft()).toBe(true);
    // expect(resultTest1.value as Error).toEqual(new InvalidUserEmailError(''));

    const resultTest2 = await usecase.perform({ ...data, email: 'email@test' });
    expect(resultTest2.isLeft()).toBe(true);
    // expect(resultTest2.value as Error).toEqual(
    //   new InvalidUserEmailError(data.email),
    // );
  });

  it('Create User: should error if CreateUserUseCase request document invalid and isLeft value is true', async () => {
    const resultTest1 = await usecase.perform({ ...data, document: '' });
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(new InvalidUserDocumentError());

    const resultTest2 = await usecase.perform({
      ...data,
      document: '0000.0000.000.-11',
    });
    expect(resultTest2.isLeft()).toBe(true);
    expect(resultTest2.value as Error).toEqual(new InvalidUserDocumentError());
  });

  it('should error if CreateUserUseCase request telephone is invalid', async () => {
    const resultTest1 = await usecase.perform({ ...data, telephone: '' });
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(
      new InvalidTelephoneValueError(),
    );

    const resultTest2 = await usecase.perform({
      ...data,
      telephone: '62903',
    });
    expect(resultTest2.isLeft()).toBe(true);
    expect(resultTest2.value as Error).toEqual(
      new InvalidTelephoneValueError(),
    );
  });

  it('should error if CreateUserUseCase request motherName is invalid', async () => {
    const resultTest1 = await usecase.perform({ ...data, motherName: '' });
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(
      new InvalidMotherNameValueError(),
    );
  });

  it('should error if CreateUserUseCase request birthDate is invalid', async () => {
    const resultTest1 = await usecase.perform({ ...data, birthDate: '' });
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(
      new InvalidBirthDateValueError(),
    );
  });

  it('Create User: should error if CreateUserUseCase request companyId invalid or company not exists in system', async () => {
    const resultTest1 = await usecase.perform({ ...data, companyId: '' });
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(new CompanyIdNotFoundError());

    const resultTest2 = await usecase.perform({
      ...data,
      companyId: randomUUID(),
    });
    expect(resultTest2.isLeft()).toBe(true);
    expect(resultTest2.value as Error).toEqual(new CompanyNotExistsError());
  });
});
