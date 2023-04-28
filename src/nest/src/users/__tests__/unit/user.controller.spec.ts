import {
  CreateUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
} from 'core/user/application';
import { UsersController } from '../../users.controller';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UserPresenter } from '../../presenter/user.presenter';
import { UpdateUserDto } from '../../dtos/update-user';

describe('user controller unit test', () => {
  let controller: UsersController;
  beforeEach(async () => {
    controller = new UsersController();
  });
  it('should create a new user', async () => {
    const output: CreateUserUseCase.Output = {
      id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
      email: 'some@mail.com',
      name: 'some name',
      email_confirmation: false,
      password: 'some password',
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['createUseCase'] = mockCreateUseCase as any;

    const input: CreateUserDto = {
      email: 'some@mail.com',
      name: 'some name',
      password: 'some password',
      created_at: new Date(),
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(output));
  });

  it('should update a user', async () => {
    const id = '97169dd3-afb7-4372-ad7b-5630ec2b6a81';
    const output: UpdateUserUseCase.Output = {
      id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
      email: 'some@mail.com',
      name: 'some name',
      email_confirmation: false,
      password: 'some password',
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    controller['updateUserUseCase'] = mockUpdateUseCase as any;
    const input: UpdateUserDto = {
      name: 'some name',
    };
    const result = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });

    expect(output).toStrictEqual({ id, ...result });
  });

  it('should delete a user', async () => {
    const output = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input = {
      id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
    };
    controller['deleteUserUseCase'] = mockDeleteUseCase as any;
    const result = await controller.remove(input.id);
    expect(mockDeleteUseCase.execute).toBeCalledWith(input);
    expect(controller.remove(input.id)).toBeInstanceOf(Promise);
    expect(result).toStrictEqual(output);
  });

  it('should get a user', async () => {
    const id = '97169dd3-afb7-4372-ad7b-5630ec2b6a81';
    const output: GetUserUseCase.Output = {
      id,
      email: 'some@mail.com',
      name: 'some name',
      email_confirmation: false,
      password: 'some password',
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input: GetUserUseCase.Input = {
      id,
    };
    controller['getUserUseCase'] = mockGetUseCase as any;
    const result = await controller.findOne(input.id);
    expect(controller.findOne(input.id)).toBeInstanceOf(Promise);
    expect(mockGetUseCase.execute).toBeCalledWith(input);
    expect(result).toEqual(output);
  });
});
