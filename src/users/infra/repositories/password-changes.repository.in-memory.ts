import { Injectable } from '@nestjs/common/decorators';
import { Repository } from 'src/core/domain/repository';
import { PasswordChangesRepositoryContract } from 'src/users/contracts/repositories/password-changes.repository.contract';
import { PasswordChanges } from 'src/users/domain/entity/password-changes/password-changes';

@Injectable()
export class PasswordChangesRepositoryInMemory
  implements Repository<PasswordChanges>, PasswordChangesRepositoryContract
{
  public items: PasswordChanges[];

  constructor() {
    this.items = [];
  }
  getByCode(code: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getByUserId(userId: string): Promise<any> {
    return this.items.find((item) => item.userId === userId);
  }

  async create(data: PasswordChanges): Promise<void> {
    this.items.push(data);
  }

  async update(id: string, data: PasswordChanges): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);

    this.items[index] = data;
  }

  async patch(
    id: string,
    data: Partial<PasswordChanges>,
  ): Promise<PasswordChanges> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<PasswordChanges> {
    return this.items.find((item) => item.id === id);
  }

  async getAll(): Promise<PasswordChanges[]> {
    return this.items;
  }

  async getOne(filter: Partial<PasswordChanges>): Promise<PasswordChanges> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<PasswordChanges>): Promise<PasswordChanges[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    const _items: PasswordChanges[] = [];

    for (const passwordChanges of this.items) {
      if (passwordChanges.id !== id) {
        _items.push(passwordChanges);
      }
    }

    this.items = _items;
  }
}
