import { HttpStatus } from '@nestjs/common/enums';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import {
  Controller,
  Headers,
  Body,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import {
  HttpException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateServiceUseCase } from 'src/apps/use-cases/create-services-usecase';
import { DeleteServiceAppUseCase } from 'src/apps/use-cases/delete-service-app-usecase';
import { GetAllServicesAppUseCase } from 'src/apps/use-cases/get-all-services-app-usecase';
import { AddIconToServiceAppUseCase } from 'src/apps/use-cases/add-icon-to-service-app-usecase';
import { UpdateStatusServiceAppUseCase } from 'src/apps/use-cases/update-status-service-app-usecase';

import {
  DeleteServiceAppHeaderRequest,
  AddIconToServiceAppBodyRequest,
  CreateServicesBodyRequestProps,
  GetAllServicesAppHeadersRequest,
  UpdateStatusServiceAppBodyRequest,
  AddIconToServiceAppHeadersRequest,
  CreateServicesHeadersRequestProps,
  UpdateStatusServiceAppHeadersRequest,
} from 'src/apps/dtos/services-controller.dto';

@Controller('apps/services')
export class ServicesController {
  constructor(
    private readonly createAppServiceUsecase: CreateServiceUseCase,
    private readonly deleteServiceAppUseCase: DeleteServiceAppUseCase,
    private readonly getAllServicesAppUseCase: GetAllServicesAppUseCase,
    private readonly addIconToServiceAppUseCase: AddIconToServiceAppUseCase,
    private readonly updateStatusServiceAppUseCase: UpdateStatusServiceAppUseCase,
  ) {}

  @Post()
  async create(
    @Body() body: CreateServicesBodyRequestProps,
    @Headers() headers: CreateServicesHeadersRequestProps,
  ) {
    try {
      const { userId } = headers;
      const {
        name,
        type,
        pathUrl,
        ambient,
        status,
        buttonIcon,
        description,
        mobileModule,
      } = body;

      const result = await this.createAppServiceUsecase.perform({
        userId,
        name,
        type,
        status,
        pathUrl,
        ambient,
        buttonIcon,
        description,
        mobileModule,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      return result.value;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all')
  async getAllServices(@Headers() headers: GetAllServicesAppHeadersRequest) {
    try {
      const { userId } = headers;

      const result = await this.getAllServicesAppUseCase.perform({ userId });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      return result.value;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('status')
  async udpateStatus(
    @Body() body: UpdateStatusServiceAppBodyRequest,
    @Headers() headers: UpdateStatusServiceAppHeadersRequest,
  ) {
    try {
      const { userId } = headers;
      const { status, serviceId } = body;

      const result = await this.updateStatusServiceAppUseCase.perform({
        userId,
        status,
        serviceId,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      return result.value;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  async delete(@Headers() headers: DeleteServiceAppHeaderRequest) {
    try {
      const { userId, serviceid: serviceId } = headers;

      const result = await this.deleteServiceAppUseCase.perform({
        userId,
        serviceId,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      return result.value;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('icon')
  @UseInterceptors(FileInterceptor('file-icon'))
  async addIconService(
    @Body() body: AddIconToServiceAppBodyRequest,
    @Headers() headers: AddIconToServiceAppHeadersRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const { serviceId } = body;
      const { authorization } = headers;

      if (!authorization) {
        throw new UnauthorizedException(
          'Token do usuário não informado ou incorreto',
        );
      }

      const [, token] = authorization.split(' ');

      if (!token) {
        throw new UnauthorizedException(
          'Token de usuário invalido ou não informado',
        );
      }

      const result = await this.addIconToServiceAppUseCase.perform({
        file,
        token,
        serviceId,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      return result.value;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
