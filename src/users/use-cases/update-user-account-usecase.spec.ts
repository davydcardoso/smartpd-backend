import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserAdmSEED, USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';
import { InvalidNameUserError } from '../domain/entity/errors/invalid-name-user.error';
import { InvalidPasswordUserError } from '../domain/entity/errors/invalid-password-user.error';
import { InvalidUserDocumentError } from '../domain/entity/errors/invalid-user-document.error';
import { InvalidUserEmailError } from '../domain/entity/errors/invalid-user-email.error';
import { UserRepository } from '../infra/repositories/user.repository';
import { UserRepositoryPrisma } from '../infra/repositories/user.repository.prisma';
import { InvalidPasswordValueError } from './errors/invalid-password-value.error';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';
import { UserIdNotDefinedError } from './errors/userid-is-not-defined.error';
import { UpdateAccountUseCase } from './update-user-account-usecase';

describe('UpdateAccountUseCase', () => {
  let usecase: UpdateAccountUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateAccountUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryPrisma,
        },
      ],
    }).compile();

    usecase = module.get<UpdateAccountUseCase>(UpdateAccountUseCase);
  });

  it('verify if modules has ben defined', () => {
    expect(usecase).toBeDefined();
  });

  // it('should error if UpdateAccountUseCase request invalid or user data not complet', async () => {
  //   const resultTest1 = await usecase.perform({
  //     userId: '',
  //   } as any);
  //   expect(resultTest1.isLeft()).toBe(true);
  //   expect(resultTest1.value as Error).toEqual(new UserIdNotDefinedError());

  //   const resultTest2 = await usecase.perform({
  //     userId: USER_ADMIN_ID_1,
  //     name: '',
  //   } as any);
  //   expect(resultTest2.isLeft()).toBe(true);
  //   expect(resultTest2.value as Error).toEqual(new InvalidNameUserError());

  //   const resultTest3 = await usecase.perform({
  //     userId: USER_ADMIN_ID_1,
  //     name: UserAdmSEED.name,
  //     email: '',
  //   } as any);
  //   expect(resultTest3.isLeft()).toBe(true);
  //   expect(resultTest3.value as Error).toEqual(new InvalidUserEmailError(''));

  //   const resultTest4 = await usecase.perform({
  //     userId: USER_ADMIN_ID_1,
  //     name: UserAdmSEED.name,
  //     email: UserAdmSEED.email,
  //     document: '',
  //   } as any);
  //   expect(resultTest4.isLeft()).toBe(true);
  //   expect(resultTest4.value as Error).toEqual(new InvalidUserDocumentError());

  //   const resultTest5 = await usecase.perform({
  //     userId: USER_ADMIN_ID_1,
  //     name: UserAdmSEED.name,
  //     email: UserAdmSEED.email,
  //     document: UserAdmSEED.document,
  //     password: '',
  //   } as any);
  //   expect(resultTest5.isLeft()).toBe(true);
  //   expect(resultTest5.value as Error).toEqual(new InvalidPasswordUserError());
  // });

  // it('shoult error if UpdateAccountUseCase user account not exists', async () => {
  //   const result = await usecase.perform({
  //     userId: USER_ADMIN_ID_1,
  //     name: UserAdmSEED.name,
  //     email: UserAdmSEED.email,
  //     document: UserAdmSEED.document,
  //     password: UserAdmSEED.password,
  //     confirmPassword: 'Dv@_824657',
  //   });

  //   expect(result.isLeft()).toBe(true);
  //   expect(result.value as Error).toEqual(new UserAccountIsNotExistsError());
  // });

  // it('success account udpate in UpdateAccountUseCase', async () => {
  //   const result = await usecase.perform({
  //     userId: USER_ADMIN_ID_1,
  //     name: UserAdmSEED.name,
  //     email: UserAdmSEED.email,
  //     document: UserAdmSEED.document,
  //     password: UserAdmSEED.password,
  //     // confirmPassword: 'Dv@_824657',
  //   });
  //   expect(result.isRight()).toBe(true);
  // });
});
