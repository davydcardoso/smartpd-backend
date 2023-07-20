import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Controller, Headers, Put, Body, Post, Get } from '@nestjs/common';

import {
  GetAllAppsHeaderRequest,
  CreateAppBodyRequestPops,
  CreateAppHeaderRequestProps,
  AddServiceInAppCompanyRequestProps,
  AddServiceInAppCompanyHeaderRequestProps,
  GetServicesForAppsHeaderProps,
  GetServicesForAppsRequestProps,
  GetServicesByAppIdRequestProps,
  GetServicesByAppIdHeaderRequest,
} from 'src/apps/dtos/apps-controller.dto';

import { CreateAppUseCase } from 'src/apps/use-cases/create-app-usecase';
import { GetAllAppsUseCase } from 'src/apps/use-cases/get-all-apps-usecase';
import { AddServiceInAppCompanyUseCase } from 'src/apps/use-cases/add-service-in-app-company';
import { GetAllServicesAppsUseCase } from 'src/apps/use-cases/get-all-service-apps.usecase';
import { GetAllServicesByAppIdUseCase } from 'src/apps/use-cases/get-all-services-by-appid-usecase';

@Controller('apps')
export class AppsController {
  constructor(
    private readonly createAppUseCase: CreateAppUseCase,
    private readonly getAllAppsUseCase: GetAllAppsUseCase,
    private readonly getAllServicesByAppIdUseCase: GetAllServicesByAppIdUseCase,
    private readonly addServiceInAppCompanyUseCasee: AddServiceInAppCompanyUseCase,
    private readonly getAllServicesAppsUseCase: GetAllServicesAppsUseCase,
  ) {}

  @Get('/all')
  async getAllApps(@Headers() header: GetAllAppsHeaderRequest) {
    const { userId, companyId } = header;

    const result = await this.getAllAppsUseCase.perform({
      userId,
      companyId,
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

  @Put()
  async create(
    @Body() body: CreateAppBodyRequestPops,
    @Headers() headers: CreateAppHeaderRequestProps,
  ) {
    const { userId } = headers;
    const {
      name,
      status,
      version,
      companyId,
      currentPlan,
      publicationDate,
      availableVersions,
    } = body;

    const result = await this.createAppUseCase.perform({
      userId,
      name,
      status,
      version,
      companyId,
      currentPlan,
      publicationDate,
      availableVersions,
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

  @Post('/services/add')
  async addServiceInApp(
    @Body() body: AddServiceInAppCompanyRequestProps,
    @Headers() header: AddServiceInAppCompanyHeaderRequestProps,
  ) {
    const { userId, companyId } = header;
    const { appId, serviceId } = body;

    const result = await this.addServiceInAppCompanyUseCasee.perform({
      appId,
      userId,
      companyId,
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
  }

  @Get('/apps-services')
  async getServicesForApps(
    @Headers() header: GetServicesForAppsHeaderProps,
    @Body() body: GetServicesForAppsRequestProps,
  ) {
    const { appsid } = header;

    const result = await this.getAllServicesAppsUseCase.perform({
      appsid,
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

  @Get('/services/appId')
  async getServicesByAppId(
    @Body() body: GetServicesByAppIdRequestProps,
    @Headers() Headers: GetServicesByAppIdHeaderRequest,
  ) {
    const { appid } = Headers;

    const result = await this.getAllServicesByAppIdUseCase.perform({
      appId: appid,
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
