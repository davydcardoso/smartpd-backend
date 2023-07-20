import { Either, left, right } from 'src/core/logic/Either';
import { InvalidAppStatusError } from '../../errors/invalid-app-status.error';

enum AppStatus {
  PUBLISHED = 'PUBLICADO',
  REMOVED = 'REMOVIDO',
  NOT_PUBLISHED = 'NÃO PUBLICADO',
  UNDER_ANALYSIS = 'EM ANALISE',
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

    if (!!AppStatus[value]) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidAppStatusError, Status> {
    if (!this.validate(value)) {
      return left(new InvalidAppStatusError());
    }

    return right(new Status(value));
  }
}
