import { CreateAuthDto } from '../../dtos/create-auth.dto';
import { AuthenticateController } from '../../authenticate.controller';
import { CreateAuthUseCase } from 'core/auth/application';
import { AuthPresenter } from '../../presenter/authenticate.presenter';

describe('AuthenticateController unit test', () => {
  let controller: AuthenticateController;
  beforeEach(async () => {
    controller = new AuthenticateController();
  });

  it('should be created a auth for user', async () => {
    const output: CreateAuthUseCase.Output = {
      user: {
        id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
        email: 'some@mail.com',
        name: 'some name',
        email_confirmation: false,
      },
      token: 'some token',
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['createUseCase'] = mockCreateUseCase as any;
    const input: CreateAuthDto = {
      email: 'some@mail.com',
      password: 'some password',
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(AuthPresenter);
    expect(presenter).toStrictEqual(new AuthPresenter(output));
  });
});
