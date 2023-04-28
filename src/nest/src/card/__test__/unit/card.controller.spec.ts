import { CreateCardUseCase, GetCardUseCase } from 'core/card/application';
import { CardController } from '../../card.controller';
import { CreateCardDto } from '../../dtos/create-card.dto';
import { CardPresenter } from '../../presenter/card.presenter';

describe('user controller unit test', () => {
  let controller: CardController;
  beforeEach(async () => {
    controller = new CardController();
  });
  it('should create a new card', async () => {
    const output: CreateCardUseCase.Output = {
      id: 'd83a0533-5098-463c-8519-fe51864a6c05',
      name: 'some name1',
      number: 1,
      category: 'monster1',
      image_url: 'some image1',
      description: 'some description1',
      atk: 'atk1',
      def: 'def1',
      effect: 'some effect1',
      main_card: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['createUseCase'] = mockCreateUseCase as any;

    const input: CreateCardDto = {
      name: 'some name1',
      number: 1,
      category: 'monster1',
      image_url: 'some image1',
      description: 'some description1',
      atk: 'atk1',
      def: 'def1',
      effect: 'some effect1',
      main_card: true,
      created_at: new Date(),
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CardPresenter);
    expect(presenter).toStrictEqual(new CardPresenter(output));
  });

  it('should delete a card', async () => {
    const output = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input = {
      id: '97169dd3-afb7-4372-ad7b-5630ec2b6a81',
    };
    controller['deleteCardUseCase'] = mockDeleteUseCase as any;
    const result = await controller.remove(input.id);
    expect(mockDeleteUseCase.execute).toBeCalledWith(input);
    expect(controller.remove(input.id)).toBeInstanceOf(Promise);
    expect(result).toStrictEqual(output);
  });

  it('should get a card', async () => {
    const id = '97169dd3-afb7-4372-ad7b-5630ec2b6a81';
    const output: GetCardUseCase.Output = {
      id,
      name: 'some name1',
      number: 1,
      category: 'monster1',
      image_url: 'some image1',
      description: 'some description1',
      atk: 'atk1',
      def: 'def1',
      effect: 'some effect1',
      main_card: true,
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const input: GetCardUseCase.Input = {
      id,
    };
    controller['getCardUseCase'] = mockGetUseCase as any;
    const result = await controller.findOne(input.id);
    expect(controller.findOne(input.id)).toBeInstanceOf(Promise);
    expect(mockGetUseCase.execute).toBeCalledWith(input);
    expect(result).toEqual(output);
  });
});
