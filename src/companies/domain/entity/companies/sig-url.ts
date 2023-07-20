import { Either, left, right } from 'src/core/logic/Either';
import { InvalidCompanySigUrlValueError } from '../../errors/invalid-company-sigurl-value.error';

export class SigUrl {
  private readonly sigUrl: string;

  get value() {
    return this.sigUrl;
  }

  private constructor(value: string) {
    this.sigUrl = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    const regex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    if (!regex.test(value)) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidCompanySigUrlValueError, SigUrl> {
    if (!this.validate(value)) {
      return left(new InvalidCompanySigUrlValueError());
    }

    return right(new SigUrl(value));
  }
}
