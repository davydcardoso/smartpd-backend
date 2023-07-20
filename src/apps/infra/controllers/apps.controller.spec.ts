import { Test, TestingModule } from '@nestjs/testing';
import { CreateAppUseCase } from 'src/apps/use-cases/create-app-usecase';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { CompanyRepositoryPrisma } from 'src/companies/infra/repositories/company.repository.prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryPrisma } from 'src/users/infra/repositories/user.repository.prisma';
import { AppsRepository } from '../repositories/apps.repository';
import { AppsRepositoryPrisma } from '../repositories/apps.repository.prisma';
import { AppsController } from './apps.controller';
import { GetAllAppsUseCase } from 'src/apps/use-cases/get-all-apps-usecase';

describe('AppsController (e2e)', () => {
  let controller: AppsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppsController],
      imports: [PrismaModule],
      providers: [
        {
          provide: AppsRepository,
          useClass: AppsRepositoryPrisma,
        },
        {
          provide: UserRepository,
          useClass: UserRepositoryPrisma,
        },
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryPrisma,
        },
        CreateAppUseCase,
        GetAllAppsUseCase,
      ],
    }).compile();

    controller = module.get<AppsController>(AppsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
