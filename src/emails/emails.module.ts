import { MailerModule } from '@nestjs-modules/mailer/dist';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordChangesRepository } from 'src/users/infra/repositories/password-changes.repository';
import { PasswordChangesRepositoryPrisma } from 'src/users/infra/repositories/password-changes.repository.prisma';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryPrisma } from 'src/users/infra/repositories/user.repository.prisma';
import { ProcessSendmailPasswordChangesService } from './services/process-send-mail-password-changes.services';

@Module({
  controllers: [],
  imports: [
    PrismaModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        secure: process.env.EMAIL_TLS,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        // ignoreTLS: true,
      },
    }),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: PasswordChangesRepository,
      useClass: PasswordChangesRepositoryPrisma,
    },
    ProcessSendmailPasswordChangesService,
  ],
})
export class EmailsModule {}
