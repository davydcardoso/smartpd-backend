import { Either, left, right } from 'src/core/logic/Either';
import { InvalidAppVersionError } from '../../errors/invalid-app-version.error';

export class Version {
  private readonly version: string;

  get value() {
    return this.version;
  }

  private constructor(value: string) {
    this.version = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidAppVersionError, Version> {
    if (!this.validate(value)) {
      return left(new InvalidAppVersionError());
    }

    return right(new Version(value));
  }
}
