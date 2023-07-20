import { Test, TestingModule } from '@nestjs/testing';
import { ValidateLoginUserUseCase } from './validate-login-user-usecase';

describe('ValidateLoginUserUseCase', () => {
  let usecase: ValidateLoginUserUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidateLoginUserUseCase],
    }).compile();

    usecase = module.get<ValidateLoginUserUseCase>(ValidateLoginUserUseCase);
  });

  it('verify if usecase module has ben defined', () => {
    expect(usecase).toBeDefined();
  });

  const data = {
    document: '000.000.000-11',
    password: '12345',
  };
});
