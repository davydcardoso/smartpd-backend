import { Entity } from 'src/core/domain/entity';
import { Either, right } from 'src/core/logic/Either';

import { Name } from './name';
import { Status } from './status';
import { Version } from './version';
import { CurrentPlan } from './current-plan';

type AppsProps = {
  name: Name;
  status: Status;
  version: Version;
  companyId: string;
  currentPlan: CurrentPlan;
  publicationDate?: Date;
  availableVersions: string;
  createdAt?: Date;
  updatedAt: Date;
};

export class Apps extends Entity<AppsProps> {
  get name() {
    return this.props.name;
  }

  get status() {
    return this.props.status;
  }

  get version() {
    return this.props.version;
  }

  get currentPlan() {
    return this.props.currentPlan;
  }

  get publicationDate() {
    return this.props.publicationDate;
  }

  get availableVersions() {
    return this.props.availableVersions;
  }

  get companyId() {
    return this.props.companyId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: AppsProps, id?: string) {
    super(props, id);
  }

  static create(props: AppsProps, id?: string): Either<Error, Apps> {
    const apps = new Apps(props, id);

    return right(apps);
  }
}
