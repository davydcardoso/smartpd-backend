import { Either, left, right } from 'src/core/logic/Either';
import { InvalidServiceStatusError } from '../../errors/invalid-service-status.error';

enum ServicesStatus {
  ONLINE,
  OFFLINE,
}

export class Status {
  private readonly status: string;

  get value() {
    return this.status;
  }

  private constructor(value: string) {
    this.status = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    if (ServicesStatus[value] === undefined) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidServiceStatusError, Status> {
    if (!this.validate(value)) {
      return left(new InvalidServiceStatusError());
    }

    return right(new Status(value));
  }
}
