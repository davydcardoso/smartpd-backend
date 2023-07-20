import { Either, left, right } from 'src/core/logic/Either';
import { InvalidServicePathUrlError } from '../../errors/invalid-service-pathurl.error';

export class PathUrl {
  private readonly pathurl: string;

  get value() {
    return this.pathurl;
  }

  private constructor(value: string) {
    this.pathurl = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 4 || value.trim().length > 255) {
      return false;
    }

    const baseurl = process.env.API_URL;

    if (!baseurl) {
      throw new Error(
        'Erro de configuração da aplicação | base url não definida',
      );
    }

    const regex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    if (!regex.test(value)) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidServicePathUrlError, PathUrl> {
    if (!this.validate(value)) {
      return left(new InvalidServicePathUrlError());
    }

    return right(new PathUrl(value));
  }
}
