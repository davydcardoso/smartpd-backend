import { Mapper } from 'src/core/domain/mapper';

import { PasswordChanges } from '../domain/entity/password-changes/password-changes';
import { PasswordChanges as PasswordChangesPersistence } from '@prisma/client';

export class PasswordChangesMapper extends Mapper<
  PasswordChanges,
  PasswordChangesPersistence
> {
  toDomain(raw: PasswordChangesPersistence): PasswordChanges {
    const passwordChangesOrError = PasswordChanges.create(
      {
        code: raw.code,
        userId: raw.userId,
        expiresIn: raw.expiresIn,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );

    if (passwordChangesOrError.isRight()) {
      return passwordChangesOrError.value;
    }

    return null;
  }
  async toPersistence(
    raw: PasswordChanges,
  ): Promise<PasswordChangesPersistence> {
    return {
      id: raw.id,
      code: raw.code,
      userId: raw.userId,
      expiresIn: raw.expiresIn,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
