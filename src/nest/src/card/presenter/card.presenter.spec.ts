import { instanceToPlain } from 'class-transformer';
import { CardCollectionPresenter, CardPresenter } from './card.presenter';
import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';

describe('card presenter unit test', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CardPresenter({
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
        created_at,
      });
      expect(presenter.id).toBe('d83a0533-5098-463c-8519-fe51864a6c05');
      expect(presenter.name).toBe('some name1');
      expect(presenter.number).toBe(1);
      expect(presenter.category).toBe('monster1');
      expect(presenter.image_url).toBe('some image1');
      expect(presenter.description).toBe('some description1');
      expect(presenter.atk).toBe('atk1');
      expect(presenter.def).toBe('def1');
      expect(presenter.effect).toBe('some effect1');
      expect(presenter.main_card).toBeTruthy();
      expect(presenter.created_at).toBe(created_at);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      const presenter = new CardPresenter({
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
        created_at,
      });
      const data = instanceToPlain(presenter);

      expect(data).toStrictEqual({
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
        created_at: created_at.toISOString(),
      });
    });
  });
});

describe('UserCollectionPresenter unit tests', () => {
  describe('constructor', () => {
    it('should set value', () => {
      const created_at = new Date();
      const presenter = new CardCollectionPresenter({
        items: [
          {
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
            created_at,
          },
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      );
      expect(presenter.data).toStrictEqual([
        new CardPresenter({
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
          created_at,
        }),
      ]);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      let presenter = new CardCollectionPresenter({
        items: [
          {
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
            created_at,
          },
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });
      expect(instanceToPlain(presenter)).toStrictEqual({
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        },
        data: [
          {
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
            created_at: created_at.toISOString(),
          },
        ],
      });
      presenter = new CardCollectionPresenter({
        items: [
          {
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
            created_at,
          },
        ],
        current_page: '1' as any,
        per_page: '2' as any,
        last_page: '3' as any,
        total: '4' as any,
      });
      expect(instanceToPlain(presenter)).toStrictEqual({
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        },
        data: [
          {
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
            created_at: created_at.toISOString(),
          },
        ],
      });
    });
  });
});
