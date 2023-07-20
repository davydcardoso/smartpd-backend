import { Apps } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

import { Repository } from 'src/core/domain/repository';
import { AppsMapper } from 'src/apps/mappers/apps.mapper';

import { Apps as AppEntity } from 'src/apps/domain/entity/apps/apps';

import { AppsRepositoryContract } from 'src/apps/contracts/repositories/apps.repository.contract';

import { COMPANY_ADMIN_ID } from 'src/prisma/seed.constants';

@Injectable()
export class AppsRepositoryInMemory
  implements Repository<AppEntity>, AppsRepositoryContract
{
  private apps: Apps[] = [];
  private mapper: AppsMapper;

  constructor() {
    this.mapper = new AppsMapper();

    this.apps.push({
      id: '4643a988-822d-4f46-9f76-30e5ee4f506f',
      name: 'SmartPD Prodata',
      status: 'NOT_PUBLISHED',
      version: '0.0.0.2',
      companiesId: COMPANY_ADMIN_ID,
      currentPlan: 'LITE',
      publicationDate: new Date(),
      availableVersions: '0.0.0.0.1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async create(app: AppEntity): Promise<void> {
    const data = await this.mapper.toPersistence(app);

    this.apps.push(data);
  }

  async update(id: string, data: AppEntity): Promise<void> {
    const index = this.apps.findIndex((item) => item.id === id);

    this.apps[index] = await this.mapper.toPersistence(data);
  }

  async patch(id: string, data: Partial<AppEntity>): Promise<AppEntity> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<AppEntity> {
    const item = this.apps.find((item) => item.id === id);

    if (!item) {
      return null;
    }

    return this.mapper.toDomain(item);
  }

  async getAll(): Promise<AppEntity[]> {
    return this.apps.map((item) => this.mapper.toDomain(item));
  }

  async getOne(filter: Partial<AppEntity>): Promise<AppEntity> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<AppEntity>): Promise<AppEntity[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    const items: Apps[] = [];

    for (const app of this.apps) {
      if (app.id !== id) {
        this.apps.push(app);
      }
    }
  }

  async getByCompanyId(companyId: string): Promise<any> {
    const item = this.apps.find((item) => item.companiesId === companyId);

    if (!item) {
      return null;
    }

    return this.mapper.toDomain(item);
  }

  async addService(appId: string, serviceId: string): Promise<void> {
    return;
  }

  async removeService(appId: string, serviceId: string): Promise<void> {
    return;
  }
}
