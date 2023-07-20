import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { PrismaModule } from 'src/prisma/prisma.module';

import { multerOptions } from 'src/configs/multer';

import { AppsRepository } from './infra/repositories/apps.repository';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { ServicesRepository } from './infra/repositories/services.repository';

import { AppsRepositoryPrisma } from './infra/repositories/apps.repository.prisma';
import { UserRepositoryPrisma } from 'src/users/infra/repositories/user.repository.prisma';
import { CompanyRepositoryPrisma } from 'src/companies/infra/repositories/company.repository.prisma';
import { ServicesRepositoryPrisma } from './infra/repositories/services.repository.prisma';

import { AppsController } from './infra/controllers/apps.controller';
import { ServicesController } from './infra/controllers/services.controller';

import { CreateAppUseCase } from './use-cases/create-app-usecase';
import { GetAllAppsUseCase } from './use-cases/get-all-apps-usecase';
import { CreateServiceUseCase } from './use-cases/create-services-usecase';
import { DeleteServiceAppUseCase } from './use-cases/delete-service-app-usecase';
import { GetAllServicesAppUseCase } from './use-cases/get-all-services-app-usecase';
import { GetAllServicesAppsUseCase } from './use-cases/get-all-service-apps.usecase';
import { AddIconToServiceAppUseCase } from './use-cases/add-icon-to-service-app-usecase';
import { GetAllServicesByAppIdUseCase } from './use-cases/get-all-services-by-appid-usecase';
import { UpdateStatusServiceAppUseCase } from './use-cases/update-status-service-app-usecase';
import { AddServiceInAppCompanyUseCase } from './use-cases/add-service-in-app-company';

@Module({
  controllers: [AppsController, ServicesController],
  imports: [
    PrismaModule,
    MulterModule.register(multerOptions),
    ConfigModule.forRoot({ envFilePath: '.env' }),
  ],
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
    {
      provide: ServicesRepository,
      useClass: ServicesRepositoryPrisma,
    },
    CreateAppUseCase,
    GetAllAppsUseCase,
    CreateServiceUseCase,
    DeleteServiceAppUseCase,
    GetAllServicesAppUseCase,
    GetAllServicesAppsUseCase,
    AddIconToServiceAppUseCase,
    GetAllServicesByAppIdUseCase,
    UpdateStatusServiceAppUseCase,
    AddServiceInAppCompanyUseCase,
  ],
})
export class AppsModule {}
