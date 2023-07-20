import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';

import { USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';

import { PrismaModule } from 'src/prisma/prisma.module';

import { UserRepository } from '../infra/repositories/user.repository';
import { UserRepositoryInMemory } from '../infra/repositories/user.repository.in-memory';

import { DeleteUserAccountUseCase } from './delete-user-account-usecase';

import { UserAccountNotExistsError } from 'src/auth/errors/user-account-not-exists.error';
import { InvalidUserIdNotInformedError } from './errors/invalid-userid-not-informed.error';

describe('DeleteUserAccountUseCase', () => {
  let usecase: DeleteUserAccountUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserAccountUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryInMemory,
        },
      ],
    }).compile();

    usecase = module.get<DeleteUserAccountUseCase>(DeleteUserAccountUseCase);
  });

  it('Testing success if usecase has ben defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should error if DeleteUserAccountUseCase userid not informed', async () => {
    const result = await usecase.perform({ userId: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new InvalidUserIdNotInformedError());
  });

  it('should error if DeleteUserAccountUseCase user account not exists', async () => {
    const result = await usecase.perform({ userId: randomUUID() });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(new UserAccountNotExistsError());
  });

  it('should success if DeleteUserAccountUseCase has ben conclued ', async () => {
    const result = await usecase.perform({ userId: USER_ADMIN_ID_1 });

    expect(result.isRight()).toBe(true);
  });
});
