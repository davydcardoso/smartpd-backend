import { Injectable } from '@nestjs/common/decorators';
import { Repository } from 'src/core/domain/repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordChangesRepositoryContract } from 'src/users/contracts/repositories/password-changes.repository.contract';
import { PasswordChanges } from 'src/users/domain/entity/password-changes/password-changes';
import { PasswordChangesMapper } from 'src/users/mappers/password-changes.mapper';

@Injectable()
export class PasswordChangesRepositoryPrisma
  implements Repository<PasswordChanges>, PasswordChangesRepositoryContract
{
  private mapper: PasswordChangesMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new PasswordChangesMapper();
  }

  async getByCode(code: string): Promise<PasswordChanges> {
    const passwordChange = await this.prisma.passwordChanges.findUnique({
      where: { code },
    });

    if (!passwordChange) {
      return null;
    }

    return this.mapper.toDomain(passwordChange);
  }

  async getByUserId(userId: string): Promise<PasswordChanges[]> {
    const passwordChanges = await this.prisma.passwordChanges.findMany({
      where: { userId },
    });

    if (!passwordChanges || passwordChanges.length <= 0) {
      return null;
    }

    return passwordChanges.map((item) => this.mapper.toDomain(item));
  }

  async create(raw: PasswordChanges): Promise<void> {
    const data = await this.mapper.toPersistence(raw);

    await this.prisma.passwordChanges.create({ data });
  }

  async update(id: string, raw: PasswordChanges): Promise<void> {
    const data = await this.mapper.toPersistence(raw);

    await this.prisma.passwordChanges.update({ data, where: { id } });
  }

  async patch(
    id: string,
    data: Partial<PasswordChanges>,
  ): Promise<PasswordChanges> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<PasswordChanges> {
    const passwordChange = await this.prisma.passwordChanges.findUnique({
      where: { id },
    });

    if (!passwordChange) {
      return null;
    }

    return this.mapper.toDomain(passwordChange);
  }

  async getAll(): Promise<PasswordChanges[]> {
    const passwordChanges = await this.prisma.passwordChanges.findMany();

    if (!passwordChanges || passwordChanges.length <= 0) {
      return null;
    }

    return passwordChanges.map((item) => this.mapper.toDomain(item));
  }

  async getOne(filter: Partial<PasswordChanges>): Promise<PasswordChanges> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<PasswordChanges>): Promise<PasswordChanges[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.prisma.passwordChanges.delete({ where: { id } });
  }
}
