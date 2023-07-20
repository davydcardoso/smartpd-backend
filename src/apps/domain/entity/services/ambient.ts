import { Either, left, right } from 'src/core/logic/Either';
import { InvalidAmbientValueError } from '../../errors/invalid-ambient-value.error';

export enum ServicesAmbient {
  PRODUCTION,
  DEVELOPMENT,
  SANDBOX,
}

export class Ambient {
  private readonly ambient: string;

  get value() {
    return this.ambient;
  }

  private constructor(value: string) {
    this.ambient = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    if (ServicesAmbient[value] === undefined) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidAmbientValueError, Ambient> {
    if (!this.validate(value)) {
      return left(new InvalidAmbientValueError());
    }

    return right(new Ambient(value));
  }
}
