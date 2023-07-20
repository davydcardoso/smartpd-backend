import { randomUUID } from 'crypto';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';

import { UserRepository } from '../infra/repositories/user.repository';
import { UserRepositoryInMemory } from '../infra/repositories/user.repository.in-memory';
import { PasswordChangesRepository } from '../infra/repositories/password-changes.repository';
import { PasswordChangesRepositoryInMemory } from '../infra/repositories/password-changes.repository.in-memory';

import { UserIdNotDefinedError } from './errors/userid-is-not-defined.error';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';
import { UpdatePasswordAccountUseCase } from './update-password-account-usecase';

describe('UpdatePasswordAccountUseCase', () => {
  let usecase: UpdatePasswordAccountUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdatePasswordAccountUseCase],
      imports: [
        BullModule.forRoot({
          redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASS || null,
          },
        }),
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        BullModule.registerQueue({ name: 'send-email:queue' }),
      ],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: PasswordChangesRepository,
          useClass: PasswordChangesRepositoryInMemory,
        },
      ],
    }).compile();

    usecase = module.get<UpdatePasswordAccountUseCase>(
      UpdatePasswordAccountUseCase,
    );
  });

  it('should success if module has ben defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should error if UpdatePasswordAccountUseCase request user id is invalid', async () => {
    const result = await usecase.perform({ userId: '' });
    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new UserIdNotDefinedError());
  });

  it('should error if UpdateAccountUseCase user not exists', async () => {
    const result = await usecase.perform({ userId: randomUUID() });
    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new UserAccountIsNotExistsError());
  });

  // it('should error if UpdateAccountUseCase if user email not activated', async () => {
  //   const result = await usecase.perform({ userId: USER_ADMIN_ID_1 });
  //   expect(result.isLeft()).toBe(true);
  //   expect(result.value as Error).toEqual(new UserEmailNotConfirmedError());
  // });

  // it('it should give error if user UpdateAccountUseCase has already requested password change', async () => {
  //   const result = await usecase.perform({ userId: USER_ADMIN_ID_1 });
  //   expect(result.isLeft()).toBe(true);
  //   expect(result.value as Error).toEqual(
  //     new PasswordChangeAlreadyRequestedError(),
  //   );
  // });

  it('should success if UpdateAccountUseCase updated success', async () => {
    const result = await usecase.perform({ userId: USER_ADMIN_ID_1 });
    expect(result.isRight()).toBe(true);
  });
});
