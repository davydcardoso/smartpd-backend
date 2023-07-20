import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { CompaniesController } from './infra/controllers/companies.controller';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from './infra/repositories/company.repository';

import { UserRepositoryPrisma } from 'src/users/infra/repositories/user.repository.prisma';
import { CompanyRepositoryPrisma } from './infra/repositories/company.repository.prisma';

import { CreateCompanyUseCase } from './use-cases/create-company-usecase';
import { GetCompanyDataUseCase } from './use-cases/get-company-data-usecase';
import { UpdateCompanyDataUseCase } from './use-cases/udpate-company-data-usecase';
import { UpdateCompanyStatusUseCase } from './use-cases/update-company-status-usecase';
import { DeleteCompanyAccountUseCase } from './use-cases/delete-company-account-usecase';
import { GetAllCompanyRegisteredUseCase } from './use-cases/get-all-company-registered-usecase';

@Module({
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
})
export class CompaniesModule {}
