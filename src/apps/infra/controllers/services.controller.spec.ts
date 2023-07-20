import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from 'src/prisma/prisma.module';

import { ServicesController } from './services.controller';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { ServicesRepository } from '../repositories/services.repository';

import { UserRepositoryInMemory } from 'src/users/infra/repositories/user.repository.in-memory';
import { CompanyRepositoryInMemory } from 'src/companies/infra/repositories/company.repository.in-memory';
import { ServicesRepositoryInMemory } from '../repositories/services.repository.in-memory';

import { CreateServiceUseCase } from 'src/apps/use-cases/create-services-usecase';
import { DeleteServiceAppUseCase } from 'src/apps/use-cases/delete-service-app-usecase';
import { GetAllServicesAppUseCase } from 'src/apps/use-cases/get-all-services-app-usecase';
import { AddIconToServiceAppUseCase } from 'src/apps/use-cases/add-icon-to-service-app-usecase';
import { UpdateStatusServiceAppUseCase } from 'src/apps/use-cases/update-status-service-app-usecase';

describe('ServicesController', () => {
  let app: NestFastifyApplication;
  let controller: ServicesController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
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
        {
          provide: ServicesRepository,
          useClass: ServicesRepositoryInMemory,
        },
        CreateServiceUseCase,
        DeleteServiceAppUseCase,
        GetAllServicesAppUseCase,
        AddIconToServiceAppUseCase,
        UpdateStatusServiceAppUseCase,
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  const data = {
    name: 'Serviço de Teste',
    pathUrl: 'http://api.prodata.com/v1/api/url-test',
    buttonIcon: 'https://cdn-icons-png.flaticon.com/512/1828/1828108.png',
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled`,
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should error if ServicesController create service user not authenticated', async () => {
  //   return app
  //     .inject({
  //       method: 'POST',
  //       path: '/services',
  //       headers: {},
  //       payload: { ...data },
  //     })
  //     .then((result) => {
  //       expect(result.statusCode).toBe(401);
  //     });
  // });

  afterAll(async () => {
    await app.close();
  });
});
