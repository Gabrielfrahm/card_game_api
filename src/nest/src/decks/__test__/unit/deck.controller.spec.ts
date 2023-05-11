import { CreateDeckUseCase, GetDeckUseCase } from 'core/deck/application';
import { DecksController } from '../../decks.controller';
import { CreateDeckDto } from '../../dtos/create-deck.dto';
import { DeckPresenter } from '../../presenter/deck.presenter';

describe('user controller unit test', () => {
  let controller: DecksController;
  beforeEach(async () => {
    controller = new DecksController();
  });
  it('should create a new deck', async () => {
    const output: CreateDeckUseCase.Output = {
      id: 'd83a0533-5098-463c-8519-fe51864a6c05',
      name: 'some name1',
      user: {
        id: 'fdd43ba0-b19d-4496-a5aa-289ce7e600b4',
        email: 'dale@dale.com',
        email_confirmation: false,
        name: 'user test',
        password: 'sadas',
        created_at: new Date(),
      },
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['createUseCase'] = mockCreateUseCase as any;

    const input: CreateDeckDto = {
      name: 'some name1',
      user_id: 'fdd43ba0-b19d-4496-a5aa-289ce7e600b4',
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(DeckPresenter);
    expect(presenter).toStrictEqual(new DeckPresenter(output));
  });

  it('should delete a deck', async () => {
    const output = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input = {
      id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
    };
    controller['deleteDeckUseCase'] = mockDeleteUseCase as any;
    const result = await controller.remove(input.id);
    expect(mockDeleteUseCase.execute).toBeCalledWith(input);
    expect(controller.remove(input.id)).toBeInstanceOf(Promise);
    expect(result).toStrictEqual(output);
  });

  it('should get a card', async () => {
    const id = '97169dd3-afb7-4372-ad7b-5630ec2b6a81';
    const output: CreateDeckUseCase.Output = {
      id,
      name: 'some name1',
      user: {
        id: 'fdd43ba0-b19d-4496-a5aa-289ce7e600b4',
        email: 'dale@dale.com',
        email_confirmation: false,
        name: 'user test',
        password: 'sadas',
        created_at: new Date(),
      },
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input: GetDeckUseCase.Input = {
      id,
    };
    controller['getUseCase'] = mockGetUseCase as any;
    const result = await controller.findOne(input.id);
    expect(controller.findOne(input.id)).toBeInstanceOf(Promise);
    expect(mockGetUseCase.execute).toBeCalledWith(input);
    expect(result).toEqual(output);
  });
});
