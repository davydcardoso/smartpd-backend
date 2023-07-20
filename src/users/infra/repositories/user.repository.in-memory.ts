import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { Repository } from 'src/core/domain/repository';
import {
  USER_ADMIN_DOCUMENT_1,
  USER_ADMIN_ID_1,
} from 'src/prisma/seed.constants';

import { User } from 'src/users/domain/entity/users/user.entity';

import { createUserTesting } from '../../../../test/user-factory';
import { UserRepositoryContract } from 'src/users/contracts/repositories/users.repository.contract';

@Injectable()
export class UserRepositoryInMemory
  implements Repository<User>, UserRepositoryContract
{
  public users: User[];

  constructor() {
    this.users = [];

    this.users.push(createUserTesting());
  }

  async getByDocument(document: string): Promise<User> {
    return this.users.find((user) => user.document.value === document);
  }

  async create(data: User): Promise<void> {
    this.users.push(data);
  }

  async update(id: string, data: User): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex] = data;
  }

  async patch(id: string, data: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async getOne(filter: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<User>): Promise<User[]> {
    return this.users;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex] = null;
  }

  async getByEmail(email: string): Promise<any> {
    return this.users.find((user) => user.email.value === email);
  }
}
