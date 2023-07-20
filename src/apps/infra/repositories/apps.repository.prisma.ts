import { Injectable } from '@nestjs/common';
import { AppsMapper } from 'src/apps/mappers/apps.mapper';
import { Repository } from 'src/core/domain/repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { Apps as AppEntity } from 'src/apps/domain/entity/apps/apps';

import { AppsRepositoryContract } from '../../contracts/repositories/apps.repository.contract';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppsRepositoryPrisma
  implements Repository<AppEntity>, AppsRepositoryContract<AppEntity>
{
  private mapper: AppsMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new AppsMapper();
  }

  async create(apps: AppEntity): Promise<void> {
    const data = await this.mapper.toPersistence(apps);

    await this.prisma.apps.create({ data });
  }

  async update(id: string, apps: AppEntity): Promise<void> {
    const data = await this.mapper.toPersistence(apps);

    await this.prisma.apps.update({ data, where: { id } });
  }

  async patch(id: string, data: Partial<AppEntity>): Promise<AppEntity> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<AppEntity> {
    const app = await this.prisma.apps.findUnique({ where: { id } });

    if (!app) {
      return null;
    }

    return this.mapper.toDomain(app);
  }

  async getByCompanyId(companyId: string): Promise<AppEntity[]> {
    const apps = await this.prisma.apps.findMany({
      where: { companiesId: companyId },
    });

    if (!apps || apps.length <= 0) {
      return null;
    }

    return apps.map((item) => this.mapper.toDomain(item));
  }

  async getAll(): Promise<AppEntity[]> {
    const apps = await this.prisma.apps.findMany({
      include: {
        companies: {},
      },
    });

    if (!apps || apps.length <= 0) {
      return null;
    }

    return apps.map((item) => this.mapper.toDomain(item));
  }

  async getOne(filter: Partial<AppEntity>): Promise<AppEntity> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<AppEntity>): Promise<AppEntity[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.prisma.apps.delete({ where: { id } });
  }

  async addService(appId: string, serviceId: string): Promise<void> {
    await this.prisma.appsServices.create({
      data: { appsId: appId, serviceId, createdAt: new Date() },
    });
  }

  async removeService(appId: string, serviceId: string): Promise<void> {
    await this.prisma.$executeRaw(
      Prisma.sql`DELETE FROM apps_services WHERE service_id = ${serviceId} AND apps_id = ${appId}`,
    );
  }
}
