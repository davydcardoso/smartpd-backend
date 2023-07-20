import { Either, left, right } from 'src/core/logic/Either';
import { InvalidCompanyStatusError } from '../../errors/invalid-company-status.error';

export enum CompanyStatus {
  ACTIVATED,
  DEACTIVATED,
  REMOVED,
  EXCLUDED,
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

    if (CompanyStatus[value] === undefined) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidCompanyStatusError, Status> {
    if (!this.validate(value)) {
      return left(new InvalidCompanyStatusError());
    }

    return right(new Status(value));
  }
}
