import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UsersController } from './infra/controllers/users.controller';

import { UserRepository } from './infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { UserRepositoryPrisma } from './infra/repositories/user.repository.prisma';
import { CompanyRepositoryPrisma } from 'src/companies/infra/repositories/company.repository.prisma';
import { PasswordChangesRepository } from './infra/repositories/password-changes.repository';
import { PasswordChangesRepositoryPrisma } from './infra/repositories/password-changes.repository.prisma';

import { CreateUserUseCase } from './use-cases/create-user-usecase';
import { UpdateAccountUseCase } from './use-cases/update-user-account-usecase';
import { GetUserAccountUseCase } from './use-cases/get-user-account-usecase';
import { DeleteUserAccountUseCase } from './use-cases/delete-user-account-usecase';
import { AlterAccountPasswordUseCase } from './use-cases/alter-account-password-usecase';
import { UpdatePasswordAccountUseCase } from './use-cases/update-password-account-usecase';

@Module({
  controllers: [UsersController],
  imports: [
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
})
export class UsersModule {}
