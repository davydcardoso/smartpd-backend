import { Entity } from 'src/core/domain/entity';
import { Either, right } from 'src/core/logic/Either';

import { Name } from './name';
import { Email } from './email';
import { Document } from './document';
import { Status } from './status';
import { SigUrl } from './sig-url';

type CompaniesProps = {
  name: Name;
  email: Email;
  document: Document;
  sigUrl?: SigUrl;
  responsibleEntity?: string;
  status: Status;
  createdAt?: Date;
  updatedAt: Date;
};

export class CompanyEntity extends Entity<CompaniesProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get document() {
    return this.props.document;
  }

  get status() {
    return this.props.status;
  }

  get sigUrl() {
    return this.props.sigUrl;
  }

  get responsibleEntity() {
    return this.props.responsibleEntity;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: CompaniesProps, id?: string) {
    super(props, id);
  }

  static create(
    props: CompaniesProps,
    id?: string,
  ): Either<Error, CompanyEntity> {
    const company = new CompanyEntity(props, id);

    return right(company);
  }
}
