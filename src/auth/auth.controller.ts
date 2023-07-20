import {
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

import { CompanyIsNotExistsError } from './errors/company-is-not-exists.error';
import { InvalidUserDocumentError } from 'src/users/domain/entity/errors/invalid-user-document.error';
import { PasswordIsNotCompareError } from './errors/password-is-not-compare.error';
import { CompanyAccountNotActivedError } from './errors/company-account-not-actived.error';

type SignInRequestHeadersProps = {
  authorization: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('login')
  async signin(
    @Res() res: Response,
    @Headers() header: SignInRequestHeadersProps,
  ): Promise<any> {
    const { authorization } = header;

    if (!authorization) {
      throw new HttpException(
        'Token não informado na requisição',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [, token] = authorization.split(' ');
    const [username, password] = Buffer.from(token, 'base64')
      .toString('ascii')
      .split(':');

    const resultValidation = await this.authServices.validateUser(
      username,
      password,
    );

    if (resultValidation.isLeft()) {
      const error = resultValidation.value;
      const message = error.message;

      switch (error.constructor) {
        case PasswordIsNotCompareError:
          throw new UnauthorizedException(message);
        case InvalidUserDocumentError:
          throw new UnauthorizedException(message);
        case CompanyIsNotExistsError:
          throw new UnauthorizedException(message);
        case CompanyAccountNotActivedError:
          throw new UnauthorizedException(message);
        default:
          throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
    }

    const user = resultValidation.value;

    const session = await this.authServices.generateToken(user);

    if (session.isLeft()) {
      const error = session.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    return res.status(200).send(session.value);
  }
}
