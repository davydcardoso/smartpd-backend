import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Headers,
  Get,
  Put,
  Delete,
} from '@nestjs/common';

import { CreateUserUseCase } from 'src/users/use-cases/create-user-usecase';
import { UpdateAccountUseCase } from 'src/users/use-cases/update-user-account-usecase';
import { GetUserAccountUseCase } from 'src/users/use-cases/get-user-account-usecase';
import { DeleteUserAccountUseCase } from 'src/users/use-cases/delete-user-account-usecase';
import { AlterAccountPasswordUseCase } from 'src/users/use-cases/alter-account-password-usecase';
import { UpdatePasswordAccountUseCase } from 'src/users/use-cases/update-password-account-usecase';

import {
  AlterPasswordAccountRequestBody,
  CreateUserRequestProps,
  CreateUserRrequestHeaderProps,
  DeleteUserAccountRequestHeader,
  GetUserAccountRequestHeaders,
  UpdateAccountRequestBody,
  UpdateAccountRequestHeader,
  UpdatePasswordAccoutRequestHeader,
} from 'src/users/dtos/user-controller.dto';

import { UnauthorizedException } from '@nestjs/common/exceptions';
import { CompanyNotExistsError } from 'src/users/use-cases/errors/company-not-exists.error';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserAccountUseCase: GetUserAccountUseCase,
    private readonly updateUserAccountUseCase: UpdateAccountUseCase,
    private readonly deleteUserAccountUseCase: DeleteUserAccountUseCase,
    private readonly alterAccountPasswordUseCase: AlterAccountPasswordUseCase,
    private readonly updatePasswordAccountUseCase: UpdatePasswordAccountUseCase,
  ) {}

  @Post()
  async create(
    @Body() body: CreateUserRequestProps,
    @Headers() headers: CreateUserRrequestHeaderProps,
  ) {
    const { companyid } = headers;
    const {
      name,
      email,
      password,
      document,
      telephone,
      birthDate,
      motherName,
      accessLevel,
    } = body;

    const result = await this.createUserUseCase.perform({
      name,
      email,
      password,
      document,
      accessLevel,
      companyId: companyid,
      telephone,
      birthDate,
      motherName,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CompanyNotExistsError:
          throw new UnauthorizedException(
            'Você não tem permissão para realizar está ação',
          );
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Get('my-account')
  async getAccount(
    @Headers() headers: GetUserAccountRequestHeaders,
  ): Promise<any> {
    const { userId } = headers;

    const result = await this.getUserAccountUseCase.perform({ userId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Put()
  async update(
    @Headers() headers: UpdateAccountRequestHeader,
    @Body() body: UpdateAccountRequestBody,
  ): Promise<any> {
    const { userId } = headers;
    const {
      name,
      email,
      document,
      password,
      telephone,
      birthDate,
      motherName,
      newPassword,
      confirmPassword,
    } = body;

    const result = await this.updateUserAccountUseCase.perform({
      name,
      email,
      userId,
      document,
      password,
      telephone,
      birthDate,
      motherName,
      newPassword,
      confirmPassword,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Delete()
  async delete(
    @Headers() headers: DeleteUserAccountRequestHeader,
  ): Promise<any> {
    const { userId } = headers;

    const result = await this.deleteUserAccountUseCase.perform({
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Put('change-password')
  async updatePassword(@Headers() headers: UpdatePasswordAccoutRequestHeader) {
    const { userId } = headers;

    const result = await this.updatePasswordAccountUseCase.perform({ userId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      }
    }

    return result.value;
  }

  @Put('alter-password')
  async alterPassword(@Body() body: AlterPasswordAccountRequestBody) {
    const { code, email, newPassword } = body;

    const result = await this.alterAccountPasswordUseCase.perform({
      code,
      email,
      newPassword,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }
}
