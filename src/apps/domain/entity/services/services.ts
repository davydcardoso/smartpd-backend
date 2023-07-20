import { Entity } from 'src/core/domain/entity';
import { Either, right } from 'src/core/logic/Either';

import { Name } from './name';
import { PathUrl } from './path-url';
import { Description } from './description';
import { Ambient } from './ambient';
import { Status } from './status';
import { ServiceType } from './service-type';

type ServicesProps = {
  name: Name;
  pathUrl: PathUrl;
  ambient?: Ambient;
  buttonIcon?: string;
  moduleMobile?: string;
  serviceType: ServiceType;
  description?: Description;
  servicesStatus?: Status;
  createdAt?: Date;
  updatedAt: Date;
};

export class Services extends Entity<ServicesProps> {
  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get pathUrl() {
    return this.props.pathUrl;
  }

  get buttonIcon() {
    return this.props.buttonIcon;
  }

  get moduleMobile() {
    return this.props.moduleMobile;
  }

  get serviceType() {
    return this.props.serviceType;
  }

  get ambient() {
    return this.props.ambient;
  }

  get servicesStatus() {
    return this.props.servicesStatus;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: ServicesProps, id?: string) {
    super(props, id);
  }

  static create(props?: ServicesProps, id?: string): Either<Error, Services> {
    const services = new Services(props, id);

    return right(services);
  }
}
