import { Entity } from 'src/core/domain/entity';
import { Either, right } from 'src/core/logic/Either';

type PasswordChangesProps = {
  userId: string;
  code: string;
  expiresIn: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class PasswordChanges extends Entity<PasswordChangesProps> {
  get userId() {
    return this.props.userId;
  }

  get code() {
    return this.props.code;
  }

  get expiresIn() {
    return this.props.expiresIn;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: PasswordChangesProps, id?: string) {
    super(props, id);
  }

  static create(
    props: PasswordChangesProps,
    id?: string,
  ): Either<Error, PasswordChanges> {
    const passwordChanges = new PasswordChanges(props, id);

    return right(passwordChanges);
  }
}
