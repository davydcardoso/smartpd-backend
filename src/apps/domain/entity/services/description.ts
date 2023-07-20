import { Either, left, right } from 'src/core/logic/Either';
import { InvalidServiceDescriptionError } from '../../errors/invalid-service-description.error';

export class Description {
  private readonly description: string;

  get value() {
    return this.description;
  }

  private constructor(value: string) {
    this.description = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(
    value: string,
  ): Either<InvalidServiceDescriptionError, Description> {
    if (!this.validate(value)) {
      return left(new InvalidServiceDescriptionError());
    }

    return right(new Description(value));
  }
}
