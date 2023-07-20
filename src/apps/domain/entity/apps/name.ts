import { Either, left, right } from 'src/core/logic/Either';
import { InvalidAppNameError } from '../../errors/invalid-app-name.error';

export class Name {
  private readonly name: string;

  get value() {
    return this.name;
  }

  private constructor(value: string) {
    this.name = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<Error, Name> {
    if (!this.validate(value)) {
      return left(new InvalidAppNameError());
    }

    return right(new Name(value));
  }
}
