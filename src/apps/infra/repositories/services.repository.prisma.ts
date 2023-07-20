import { Injectable } from '@nestjs/common';

import { Services } from 'src/apps/domain/entity/services/services';

import { Repository } from 'src/core/domain/repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicesMapper } from 'src/apps/mappers/services.mapper';
import { ServicesRepositoryContract } from 'src/apps/contracts/repositories/services.repository.contract';

@Injectable()
export class ServicesRepositoryPrisma
  implements Repository<Services>, ServicesRepositoryContract
{
  private mapper: ServicesMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new ServicesMapper();
  }

  async getServices(appId: string): Promise<Services[]> {
    const services = await this.prisma.services.findMany({
      include: { AppServices: true },
      where: {
        AppServices: {
          some: {
            appsId: appId,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (!services || services.length <= 0) {
      return null;
    }

    return services.map((item) => this.mapper.toDomain(item));
  }

  async getServiceForAppId(companyId: string): Promise<any> {
    const appsAndServices = await this.prisma.apps.findFirst({
      where: { companiesId: companyId },
      include: {
        companies: {},
        AppServices: {
          include: {
            services: {},
          },
        },
      },
    });

    return appsAndServices;
  }

  async getByPathUrl(pathUrl: string): Promise<any> {
    const service = await this.prisma.services.findFirst({
      where: { pathUrl },
    });

    if (!service) {
      return null;
    }

    return this.mapper.toDomain(service);
  }

  async create(services: Services): Promise<void> {
    const data = await this.mapper.toPersistence(services);

    await this.prisma.services.create({ data });
  }

  async update(id: string, services: Services): Promise<void> {
    const data = await this.mapper.toPersistence(services);

    await this.prisma.services.update({ data, where: { id } });
  }

  async patch(id: string, services: Partial<Services>): Promise<Services> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<Services> {
    const service = await this.prisma.services.findUnique({ where: { id } });

    if (!service) {
      return null;
    }

    return this.mapper.toDomain(service);
  }

  async getAll(): Promise<Services[]> {
    const services = await this.prisma.services.findMany();

    if (!services || services.length <= 0) {
      return null;
    }

    return services.map((item) => this.mapper.toDomain(item));
  }

  async getOne(filter: Partial<Services>): Promise<Services> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<Services>): Promise<Services[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.prisma.services.delete({ where: { id } });
  }
}
