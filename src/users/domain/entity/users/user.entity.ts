import { Entity } from 'src/core/domain/entity';
import { Either, right } from 'src/core/logic/Either';

import { Name } from './name';
import { Email } from './email';
import { Document } from './document';
import { Password } from './password';
import { AccessLevel } from './access-level';
import { Telephone } from './telephone';

type UserProps = {
  name: Name;
  email: Email;
  password: Password;
  document: Document;
  companyId: string;
  birthDate: Date;
  telephone: Telephone;
  motherName: string;
  emailConfirmed: boolean;
  accessLevel: AccessLevel;
  createdAt?: Date;
  updatedAt: Date;
};

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get document() {
    return this.props.document;
  }

  get companyId() {
    return this.props.companyId;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get telephone() {
    return this.props.telephone;
  }

  get motherName() {
    return this.props.motherName;
  }

  get emailConfirmed() {
    return this.props.emailConfirmed;
  }

  get accessLevel() {
    return this.props.accessLevel;
  }

  get createAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(props: UserProps, id?: string): Either<Error, User> {
    const user = new User(props, id);

    return right(user);
  }
}
