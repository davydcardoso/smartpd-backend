import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateServiceUseCase } from './create-services-usecase';

import { InvalidServiceNameError } from '../domain/errors/invalid-module-name.error';
import { InvalidServicePathUrlError } from '../domain/errors/invalid-service-pathurl.error';
import { InvalidServiceDescriptionError } from '../domain/errors/invalid-service-description.error';
import { ServicesRepository } from '../infra/repositories/services.repository';
import { ServicesRepositoryInMemory } from '../infra/repositories/services.repository.in-memory';
import { USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryInMemory } from 'src/users/infra/repositories/user.repository.in-memory';

describe('CreateServiceUseCase', () => {
  let usecase: CreateServiceUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateServiceUseCase],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: ServicesRepository,
          useClass: ServicesRepositoryInMemory,
        },
      ],
    }).compile();

    usecase = module.get<CreateServiceUseCase>(CreateServiceUseCase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  const data = {
    userId: USER_ADMIN_ID_1,
    name: 'Serviço de Teste',
    type: 'CITIZEN_SERVICES',
    status: 'ONLINE',
    pathUrl: 'http://api.prodata.com/v1/api/url-test',
    ambient: 'PRODUCTION',
    buttonIcon: 'https://cdn-icons-png.flaticon.com/512/1828/1828108.png',
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled`,
  };

  it('should error if CreateServiceUseCase request name is invalid', async () => {
    const result = await usecase.perform({ ...data, name: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new InvalidServiceNameError());
  });

  it('should error if CreateServiceUseCase request pathUrl is invalid', async () => {
    const result = await usecase.perform({ ...data, pathUrl: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new InvalidServicePathUrlError());
  });

  it('should error if CreateServiceUseCase request description is invalid', async () => {
    const result = await usecase.perform({ ...data, description: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new InvalidServiceDescriptionError());
  });

  it('should success if CreateServiceUseCase is created service', async () => {
    const result = await usecase.perform({ ...data });

    expect(result.isRight()).toBe(true);
  });
});
