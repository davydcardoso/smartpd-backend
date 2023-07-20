import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AuthMiddleware } from './auth/auth.middleware';

import { PrismaService } from './prisma/prisma.service';

import { AuthModule } from './auth/auth.module';
import { AppsModule } from './apps/apps.module';
import { UsersModule } from './users/users.module';
import { EmailsModule } from './emails/emails.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompaniesModule } from './companies/companies.module';

import { UserRepository } from './users/infra/repositories/user.repository';
import { CompanyRepository } from './companies/infra/repositories/company.repository';
import { UserRepositoryPrisma } from './users/infra/repositories/user.repository.prisma';
import { CompanyRepositoryPrisma } from './companies/infra/repositories/company.repository.prisma';

@Module({
  imports: [
    AppsModule,
    AuthModule,
    UsersModule,
    PrismaModule,
    EmailsModule,
    CompaniesModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS,
      },
    }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      // Users Routes
      { path: 'users/my-account', method: RequestMethod.GET },
      { path: 'users/', method: RequestMethod.PUT },
      { path: 'users/', method: RequestMethod.DELETE },
      { path: 'users/change-password', method: RequestMethod.PUT },

      // Companies Routes
      { path: 'companies/', method: RequestMethod.POST },
      { path: 'companies/', method: RequestMethod.DELETE },
      { path: 'companies/', method: RequestMethod.PUT },
      { path: 'companies/', method: RequestMethod.GET },
      { path: 'companies/all', method: RequestMethod.GET },
      { path: 'companies/status', method: RequestMethod.PUT },

      // Apps Routes
      { path: 'apps/', method: RequestMethod.GET },
      { path: 'apps/', method: RequestMethod.PUT },
      { path: 'apps/all', method: RequestMethod.GET },

      // Apps Services routes
      { path: 'apps/services/', method: RequestMethod.GET },
      { path: 'apps/services/', method: RequestMethod.POST },
      { path: 'apps/services/', method: RequestMethod.DELETE },
      { path: 'apps/services/all', method: RequestMethod.GET },
      { path: 'apps/services/add', method: RequestMethod.POST },
      { path: 'apps/apps-services', method: RequestMethod.GET },
      // { path: 'apps/services/appId', method: RequestMethod.GET }, - Desativado Authenticação
      { path: 'apps/services/status', method: RequestMethod.PUT },
    );
    // .apply(AdminMiddleware)
    // .forRoutes({ path: 'apps/services/test', method: RequestMethod.POST });
  }
}
