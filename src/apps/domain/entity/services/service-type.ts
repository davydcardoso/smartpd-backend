import { Either, left, right } from 'src/core/logic/Either';
import { InvalidServiceStatusValueError } from '../../errors/invalid-services-app-value.error';

enum Type {
  ANONYMOUS_SERVICES,
  CITIZEN_SERVICES,
  SERVER_PORTAL,
}

export class ServiceType {
  private readonly type: string;

  get value() {
    return this.type;
  }

  private constructor(value: string) {
    this.type = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    if (Type[value] === undefined) {
      return false;
    }

    return true;
  }

  static create(
    value: string,
  ): Either<InvalidServiceStatusValueError, ServiceType> {
    if (!this.validate(value)) {
      return left(new InvalidServiceStatusValueError());
    }

    return right(new ServiceType(value));
  }
}
