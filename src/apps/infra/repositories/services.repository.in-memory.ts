import { Services as ServicesPersistence } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Services } from 'src/apps/domain/entity/services/services';
import { ServicesMapper } from 'src/apps/mappers/services.mapper';
import { Repository } from 'src/core/domain/repository';
import { ServicesRepositoryContract } from 'src/apps/contracts/repositories/services.repository.contract';

@Injectable()
export class ServicesRepositoryInMemory
  implements Repository<Services>, ServicesRepositoryContract
{
  public items: ServicesPersistence[];
  private mapper: ServicesMapper;

  constructor() {
    this.items = [
      {
        id: '4643a988-822d-4f46-9f76-30e5ee4f506f',
        name: 'Serviço de Teste',
        ambient: 'PRODUCTION',
        pathUrl: 'http://prodata.inf.br/api',
        buttonIcon: '',
        servicesStatus: 'ONLINE',
        description: 'Descição do serviço de testes',
        serviceType: 'CITIZEN_SERVICES',
        mobileModule: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.mapper = new ServicesMapper();
  }

  getServices(appId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getServiceForAppId(companyId: string): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getByPathUrl(pathUrl: string): Promise<any> {
    const service = this.items.find((item) => item.pathUrl === pathUrl);

    if (!service) {
      return null;
    }

    return this.mapper.toDomain(service);
  }

  async create(services: Services): Promise<void> {
    const data = await this.mapper.toPersistence(services);

    this.items.push(data);
  }

  async update(id: string, services: Services): Promise<void> {
    const data = await this.mapper.toPersistence(services);

    const serviceIndex = this.items.findIndex((item) => item.id === id);

    this.items[serviceIndex] = data;
  }

  async patch(id: string, services: Partial<Services>): Promise<Services> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<Services> {
    const service = this.items.find((item) => item.id === id);

    if (!service) {
      return null;
    }

    return this.mapper.toDomain(service);
  }

  async getAll(): Promise<Services[]> {
    const services = this.items;

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
    const serviceIndex = this.items.findIndex((item) => item.id === id);

    delete this.items[serviceIndex];
  }
}
