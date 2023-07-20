import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters';
import { Test, TestingModule } from '@nestjs/testing';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';

import { UsersController } from './users.controller';

import { CreateUserUseCase } from 'src/users/use-cases/create-user-usecase';
import { UpdateAccountUseCase } from 'src/users/use-cases/update-user-account-usecase';
import { GetUserAccountUseCase } from 'src/users/use-cases/get-user-account-usecase';
import { DeleteUserAccountUseCase } from 'src/users/use-cases/delete-user-account-usecase';
import { AlterAccountPasswordUseCase } from 'src/users/use-cases/alter-account-password-usecase';
import { UpdatePasswordAccountUseCase } from 'src/users/use-cases/update-password-account-usecase';

import { UserRepository } from '../repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { PasswordChangesRepository } from '../repositories/password-changes.repository';

import { UserRepositoryPrisma } from '../repositories/user.repository.prisma';
import { CompanyRepositoryPrisma } from 'src/companies/infra/repositories/company.repository.prisma';
import { PasswordChangesRepositoryPrisma } from '../repositories/password-changes.repository.prisma';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [
        AuthModule,
        PrismaModule,
        BullModule.registerQueue({ name: 'send-email:queue' }),
      ],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryPrisma,
        },
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryPrisma,
        },
        {
          provide: PasswordChangesRepository,
          useClass: PasswordChangesRepositoryPrisma,
        },
        CreateUserUseCase,
        GetUserAccountUseCase,
        UpdateAccountUseCase,
        DeleteUserAccountUseCase,
        AlterAccountPasswordUseCase,
        UpdatePasswordAccountUseCase,
      ],
    }).compile();

    prisma = new PrismaClient();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(prisma).toBeDefined();
  });

  type PayloadProps = {
    name: string;
    email: string;
    password: string;
    document: string;
    accessLevel: string;
    birthDate: string;
    telephone: string;
    motherName: string;
  };

  describe('/POST Create User', () => {
    it('should error create user if name invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'PD',
            email: 'client@mail.com',
            document: '00.000.000/0001-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
            birthDate: '1997-03-20',
            telephone: '62983055581',
            motherName: 'Mae de teste',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if email invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail',
            document: '00.000.000/0001-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
            birthDate: '1997-03-20',
            telephone: '62983055581',
            motherName: 'Mae de teste',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if document invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail.com',
            document: '00.000.000/-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
            birthDate: '1997-03-20',
            telephone: '62983055581',
            motherName: 'Mae de teste',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if password invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail.com',
            document: '00.000.000/0001-11',
            password: 'Dv@',
            accessLevel: 'CLIENT',
            birthDate: '1997-03-20',
            telephone: '62983055581',
            motherName: 'Mae de teste',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if companyId invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: '' },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail.com',
            document: '00.000.000/0001-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
            birthDate: '1997-03-20',
            telephone: '62983055581',
            motherName: 'Mae de teste',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if company is not exists', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail.com',
            document: '00.000.000/0001-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
            birthDate: '1997-03-20',
            telephone: '62983055581',
            motherName: 'Mae de teste',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(401);
        });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
