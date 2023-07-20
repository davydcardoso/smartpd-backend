import { Mapper } from 'src/core/domain/mapper';

import { CompanyEntity } from '../domain/entity/companies/companies';
import { Companies as CompanyPersistence, CompanyStatus } from '@prisma/client';

import { Name } from '../domain/entity/companies/name';
import { Email } from '../domain/entity/companies/email';
import { Status } from '../domain/entity/companies/status';
import { SigUrl } from '../domain/entity/companies/sig-url';
import { Document } from '../domain/entity/companies/document';

export class CompanyMapper extends Mapper<CompanyEntity, CompanyPersistence> {
  toDomain(raw: CompanyPersistence): CompanyEntity {
    const nameOrError = Name.create(raw.name);
    const emailOrError = Email.create(raw.email);
    const statusOrError = Status.create(raw.status);
    const documentOrError = Document.create(raw.document);

    let sigUrl: SigUrl;

    if (raw.sigUrl) {
      const _sigUrl = SigUrl.create(raw.sigUrl);

      if (_sigUrl.isLeft()) {
        throw new Error('Company SIG Url is invalid');
      }

      sigUrl = _sigUrl.value;
    }

    if (nameOrError.isLeft()) {
      throw new Error('Company name is invalid');
    }

    if (emailOrError.isLeft()) {
      throw new Error('Company email is invalid');
    }

    if (documentOrError.isLeft()) {
      throw new Error('Company document is invalid');
    }

    if (statusOrError.isLeft()) {
      throw new Error('Company status is invalid');
    }

    const companyOrError = CompanyEntity.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        sigUrl: sigUrl || undefined,
        responsibleEntity: raw.responsibleEntity,
        status: statusOrError.value,
        document: documentOrError.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      raw.id,
    );

    if (companyOrError.isRight()) {
      return companyOrError.value;
    }

    return null;
  }

  async toPersistence(raw: CompanyEntity): Promise<CompanyPersistence> {
    return {
      id: raw.id,
      name: raw.name.value,
      email: raw.email.value,
      document: raw.document.value,
      sigUrl: raw.sigUrl ? raw.sigUrl.value : null,
      responsibleEntity: raw.responsibleEntity,
      status: CompanyStatus[raw.status.value],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
