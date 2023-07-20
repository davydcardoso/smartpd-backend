import {
  Res,
  Get,
  Put,
  Body,
  Post,
  Delete,
  Controller,
  HttpException,
} from '@nestjs/common';
import { Headers } from '@nestjs/common/decorators';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';

import { CreateCompanyUseCase } from 'src/companies/use-cases/create-company-usecase';
import { GetCompanyDataUseCase } from 'src/companies/use-cases/get-company-data-usecase';
import { UpdateCompanyDataUseCase } from 'src/companies/use-cases/udpate-company-data-usecase';
import { UpdateCompanyStatusUseCase } from 'src/companies/use-cases/update-company-status-usecase';
import { DeleteCompanyAccountUseCase } from 'src/companies/use-cases/delete-company-account-usecase';
import { GetAllCompanyRegisteredUseCase } from 'src/companies/use-cases/get-all-company-registered-usecase';

import {
  CreateCompanyRequestProps,
  UpdateCompanyDataRequestProps,
  CreateCompanyHeaderRequestProps,
  GetCompanyDataHeaderRequestProps,
  UpdateCompanyDataHeaderRequestProps,
  UpdateCompanyStatusBodyRequestProps,
  DeleteCompanyAccountBodyRequestProps,
  UpdateCompanyStatusHeadersRequestProps,
  DeleteCompanyAccountHeadersRequestProps,
  GetAllCompanyRegisteredHeaderRequestProps,
} from 'src/companies/dtos/companies-controller.dto';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly getCompanyDataUseCase: GetCompanyDataUseCase,
    private readonly createCompaniesUseCase: CreateCompanyUseCase,
    private readonly updateCompanyDataUseCase: UpdateCompanyDataUseCase,
    private readonly udpateCompanyStatusUseCase: UpdateCompanyStatusUseCase,
    private readonly deleteCompanyAccountUseCase: DeleteCompanyAccountUseCase,
    private readonly getAllCompaniesRegisteredUseCase: GetAllCompanyRegisteredUseCase,
  ) {}

  @Post()
  async create(
    @Res() response: Response,
    @Body() body: CreateCompanyRequestProps,
    @Headers() header: CreateCompanyHeaderRequestProps,
  ) {
    try {
      const { userId, userid } = header;
      const { name, email, document, sigUrl, responsibleEntity } = body;

      const result = await this.createCompaniesUseCase.perform({
        userId: userId || userid,
        name,
        email,
        sigUrl,
        document,
        responsibleEntity,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }

      response
        .status(HttpStatus.CREATED)
        .send({ message: 'Empresa cadastrada com sucesso' });
      return;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async udpate(
    @Headers() header: UpdateCompanyDataHeaderRequestProps,
    @Body() body: UpdateCompanyDataRequestProps,
  ) {
    try {
      const { userId } = header;
      const { name, email, document } = body;

      const result = await this.updateCompanyDataUseCase.perform({
        userId,
        name,
        email,
        document,
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

  @Get()
  async get(@Headers() headers: GetCompanyDataHeaderRequestProps) {
    try {
      const { userId } = headers;

      const result = await this.getCompanyDataUseCase.perform({ userId });

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
  async getAll(@Headers() headers: GetAllCompanyRegisteredHeaderRequestProps) {
    try {
      const { userId } = headers;

      const result = await this.getAllCompaniesRegisteredUseCase.perform({
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
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('status')
  async updateStatus(
    @Headers() headers: UpdateCompanyStatusHeadersRequestProps,
    @Body() body: UpdateCompanyStatusBodyRequestProps,
  ) {
    try {
      const { userId } = headers;
      const { status, customerId } = body;

      const result = await this.udpateCompanyStatusUseCase.perform({
        userId,
        status,
        customerId,
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
  async deleteCompany(
    @Headers() header: DeleteCompanyAccountHeadersRequestProps,
    @Body() body: DeleteCompanyAccountBodyRequestProps,
  ) {
    try {
      const { userId } = header;
      const { companyId } = body;

      const result = await this.deleteCompanyAccountUseCase.perform({
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
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
