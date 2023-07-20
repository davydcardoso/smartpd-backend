import { Either, left, right } from 'src/core/logic/Either';
import { InvalidAppCurrentPlanError } from '../../errors/invalid-app-current-plan.error';

export class CurrentPlan {
  private readonly currentPlan: string;

  get value() {
    return this.currentPlan;
  }

  private constructor(value: string) {
    this.currentPlan = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 4 || value.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(
    value: string,
  ): Either<InvalidAppCurrentPlanError, CurrentPlan> {
    if (!this.validate(value)) {
      return left(new InvalidAppCurrentPlanError());
    }

    return right(new CurrentPlan(value));
  }
}
