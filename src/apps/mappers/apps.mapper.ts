import { Mapper } from 'src/core/domain/mapper';

import { Apps } from '@prisma/client';
import { Apps as AppEntity } from '../domain/entity/apps/apps';

import { Name } from '../domain/entity/apps/name';
import { Status } from '../domain/entity/apps/status';
import { Version } from '../domain/entity/apps/version';
import { CurrentPlan } from '../domain/entity/apps/current-plan';

export class AppsMapper implements Mapper<AppEntity, Apps> {
  toDomain(raw: Apps): AppEntity {
    const nameOrError = Name.create(raw.name);
    const statusOrError = Status.create(raw.status);
    const versionOrError = Version.create(raw.version);
    const currentPlanOrError = CurrentPlan.create(raw.currentPlan);

    if (nameOrError.isLeft()) {
      throw new Error('App name is invalid');
    }

    if (statusOrError.isLeft()) {
      throw new Error('App status is invalid');
    }

    if (versionOrError.isLeft()) {
      throw new Error('App version is invalid');
    }

    if (currentPlanOrError.isLeft()) {
      throw new Error('App current plan is invalid');
    }

    const appOrError = AppEntity.create(
      {
        name: nameOrError.value,
        status: statusOrError.value,
        version: versionOrError.value,
        currentPlan: currentPlanOrError.value,
        companyId: raw.companiesId,
        publicationDate: raw.publicationDate,
        availableVersions: raw.availableVersions,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );

    if (appOrError.isLeft()) {
      return null;
    }

    return appOrError.value;
  }

  async toPersistence(raw: AppEntity): Promise<Apps> {
    return {
      id: raw.id,
      name: raw.name.value,
      status: raw.status.value,
      version: raw.version.value,
      currentPlan: raw.currentPlan.value,
      companiesId: raw.companyId,
      publicationDate: new Date(raw.publicationDate),
      availableVersions: raw.availableVersions,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
