import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { PasswordChangesRepository } from 'src/users/infra/repositories/password-changes.repository';
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/infra/repositories/user.repository';

type JobProps = {
  id: string;
};

@Injectable()
@Processor('send-email:queue')
export class ProcessSendmailPasswordChangesService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
    private readonly passwordChangesRepository: PasswordChangesRepository,
  ) {}

  @Process()
  async send(job: Job<JobProps>) {
    const { id } = job.data;

    try {
      const passwordChanges = await this.passwordChangesRepository.getById(id);

      if (!passwordChanges) {
        return;
      }

      const user = await this.userRepository.getById(passwordChanges.userId);

      if (!user) {
        return;
      }

      const { name, email } = user;

      await this.mailerService.sendMail({
        to: email.value,
        from: process.env.EMAIL_ADDRESS,
        subject: 'Alteração de senha | Esqueci minha senha',
        text:
          'Olá, ' +
          name.value +
          '\n\n\n' +
          'Você está recebendo este e-mail porque solicitou a recuperação de senha do portal do servidor.\n' +
          'Caso não tenha solicitado a recuperação de senha, por favor desconsidere este e-mail.\n\n' +
          'Codigo: ' +
          passwordChanges.code +
          ' \n\n' +
          'Obrigado, \n' +
          'Prodata Informatica',
      });
    } catch (err) {
      console.log(this.constructor, err.message);
    }
  }
}
