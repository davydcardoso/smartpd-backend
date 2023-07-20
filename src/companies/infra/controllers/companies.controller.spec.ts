import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { createAndAuthenticateUser } from '../../../../test/user-factory';

import { CompaniesController } from './companies.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { UserRepositoryPrisma } from 'src/users/infra/repositories/user.repository.prisma';
import { CompanyRepositoryPrisma } from '../repositories/company.repository.prisma';

import { CreateCompanyUseCase } from 'src/companies/use-cases/create-company-usecase';
import { GetCompanyDataUseCase } from 'src/companies/use-cases/get-company-data-usecase';
import { UpdateCompanyDataUseCase } from 'src/companies/use-cases/udpate-company-data-usecase';
import { USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';
import { UpdateCompanyStatusUseCase } from 'src/companies/use-cases/update-company-status-usecase';
import { GetAllCompanyRegisteredUseCase } from 'src/companies/use-cases/get-all-company-registered-usecase';
import { DeleteCompanyAccountUseCase } from 'src/companies/use-cases/delete-company-account-usecase';

describe('CompaniesController (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      imports: [PrismaModule],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryPrisma,
        },
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryPrisma,
        },
        CreateCompanyUseCase,
        GetCompanyDataUseCase,
        UpdateCompanyDataUseCase,
        UpdateCompanyStatusUseCase,
        DeleteCompanyAccountUseCase,
        GetAllCompanyRegisteredUseCase,
      ],
    }).compile();

    prisma = new PrismaClient();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  const { accessToken } = createAndAuthenticateUser();

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('/POST Create Company', () => {
    it('should error 400 if document is invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/companies',
          headers: { userId: USER_ADMIN_ID_1 },
          payload: {
            name: 'Prodata Informatica',
            email: 'prodata-test2@mail',
            document: '00.000.000/0001-11',
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    // it('should error 400 if email is invalid', async () => {
    //   return app
    //     .inject({
    //       method: 'POST',
    //       path: '/companies',
    //       headers: { authorization: `Bearer ${accessToken}` },
    //       payload: {
    //         name: 'Prodata Informatica',
    //         email: 'prodata-test2@mail',
    //         document: '00.000.000/0001-11',
    //       },
    //     })
    //     .then((result) => {
    //       expect(result.statusCode).toBe(400);
    //     });
    // });

    // it('should error 400 if name is invalid', async () => {
    //   return app
    //     .inject({
    //       method: 'POST',
    //       path: '/companies',
    //       headers: { authorization: `Bearer ${accessToken}` },
    //       payload: {
    //         name: 'PD',
    //         email: 'prodata-test2@mail',
    //         document: '00.000.000/0001-11',
    //       },
    //     })
    //     .then((result) => {
    //       expect(result.statusCode).toBe(400);
    //     });
    // });
  });

  afterAll(async () => {
    await app.close();
  });
});
