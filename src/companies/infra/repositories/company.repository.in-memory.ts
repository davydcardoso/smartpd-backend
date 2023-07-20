import { Injectable } from '@nestjs/common';
import { CompanyRepositoryContract } from 'src/companies/contracts/repositories/company.repository.contract';
import { CompanyEntity } from 'src/companies/domain/entity/companies/companies';
import { Document } from 'src/companies/domain/entity/companies/document';
import { Email } from 'src/companies/domain/entity/companies/email';
import { Name } from 'src/companies/domain/entity/companies/name';
import { Status } from 'src/companies/domain/entity/companies/status';
import { Repository } from 'src/core/domain/repository';
import { COMPANY_ADMIN_ID } from 'src/prisma/seed.constants';

@Injectable()
export class CompanyRepositoryInMemory
  implements Repository<CompanyEntity>, CompanyRepositoryContract
{
  public items: CompanyEntity[];

  constructor() {
    this.items = [];

    this.items.push(
      CompanyEntity.create(
        {
          name: Name.create('Prodata Informatica').value as Name,
          email: Email.create('dev1@prodata.com').value as Email,
          document: Document.create('00.000.000/0001-12').value as Document,
          status: Status.create('ACTIVATED').value as Status,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        COMPANY_ADMIN_ID,
      ).value as CompanyEntity,
    );
  }

  async getByEmail(email: string): Promise<any> {
    const company = this.items.find((item) => item.email.value == email);

    return company;
  }

  async getByDocument(document: string): Promise<any> {
    const company = this.items.find((item) => item.document.value == document);

    return company;
  }

  async create(data: CompanyEntity): Promise<void> {
    const companyIndex = this.items.findIndex(
      (findCompany) => findCompany.id == data.id,
    );

    this.items[companyIndex] = data;
  }

  async update(id: string, data: CompanyEntity): Promise<void> {
    const companyIndex = this.items.findIndex(
      (findCompany) => findCompany.id == id,
    );

    this.items[companyIndex] = data;
  }

  async patch(
    id: string,
    data: Partial<CompanyEntity>,
  ): Promise<CompanyEntity> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<CompanyEntity> {
    const company = this.items.find((company) => company.id === id);

    return company;
  }

  async getAll(): Promise<CompanyEntity[]> {
    throw new Error('Method not implemented.');
  }

  async getOne(filter: Partial<CompanyEntity>): Promise<CompanyEntity> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<CompanyEntity>): Promise<CompanyEntity[]> {
    return this.items;
  }

  async delete(id: string): Promise<void> {
    this.items = [];

    for (const item of this.items) {
      if (item.id !== id) {
        this.items.push(item);
      }
    }
  }
}
