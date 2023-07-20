import { Either, left, right } from 'src/core/logic/Either';
import { InvalidTelephoneValueError } from '../errors/invalid-telephone-value.error';

export class Telephone {
  private readonly telephone: string;

  get value() {
    return this.telephone;
  }

  private constructor(value: string) {
    this.telephone = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 3 || value.trim().length > 255) {
      return false;
    }

    const regex =
      /^(?:(?:\+|00)?(55)\s?)?(?:(?:\(?[1-9][0-9]\)?)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/;

    if (!regex.test(value)) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidTelephoneValueError, Telephone> {
    if (!this.validate(value)) {
      return left(new InvalidTelephoneValueError());
    }

    return right(new Telephone(value));
  }
}
