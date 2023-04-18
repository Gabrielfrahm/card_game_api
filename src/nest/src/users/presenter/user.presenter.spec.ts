import { instanceToPlain } from 'class-transformer';
import { UserCollectionPresenter, UserPresenter } from './user.presenter';
import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';

describe('user presenter unit test', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new UserPresenter({
        id: 'd83a0533-5098-463c-8519-fe51864a6c05',
        email: 'some@mail.com',
        name: 'some name',
        password: 'some password',
        email_confirmation: false,
        created_at,
      });
      expect(presenter.id).toBe('d83a0533-5098-463c-8519-fe51864a6c05');
      expect(presenter.email).toBe('some@mail.com');
      expect(presenter.name).toBe('some name');
      expect(presenter.password).toBe('some password');
      expect(presenter.email_confirmation).toBe(false);
      expect(presenter.created_at).toBe(created_at);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      const presenter = new UserPresenter({
        id: 'd83a0533-5098-463c-8519-fe51864a6c05',
        email: 'some@mail.com',
        name: 'some name',
        password: 'some password',
        email_confirmation: false,
        created_at,
      });
      const data = instanceToPlain(presenter);

      expect(data).toStrictEqual({
        id: 'd83a0533-5098-463c-8519-fe51864a6c05',
        email: 'some@mail.com',
        name: 'some name',
        password: 'some password',
        email_confirmation: false,
        created_at: created_at.toISOString(),
      });
    });
  });
});

describe('UserCollectionPresenter unit tests', () => {
  describe('constructor', () => {
    it('should set value', () => {
      const created_at = new Date();
      const presenter = new UserCollectionPresenter({
        items: [
          {
            id: 'd83a0533-5098-463c-8519-fe51864a6c05',
            email: 'some@mail.com',
            name: 'some name',
            password: 'some password',
            email_confirmation: false,
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
        new UserPresenter({
          id: 'd83a0533-5098-463c-8519-fe51864a6c05',
          email: 'some@mail.com',
          name: 'some name',
          password: 'some password',
          email_confirmation: false,
          created_at,
        }),
      ]);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      let presenter = new UserCollectionPresenter({
        items: [
          {
            id: 'd83a0533-5098-463c-8519-fe51864a6c05',
            email: 'some@mail.com',
            name: 'some name',
            password: 'some password',
            email_confirmation: false,
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
            email: 'some@mail.com',
            name: 'some name',
            password: 'some password',
            email_confirmation: false,
            created_at: created_at.toISOString(),
          },
        ],
      });
      presenter = new UserCollectionPresenter({
        items: [
          {
            id: 'd83a0533-5098-463c-8519-fe51864a6c05',
            email: 'some@mail.com',
            name: 'some name',
            password: 'some password',
            email_confirmation: false,
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
            email: 'some@mail.com',
            name: 'some name',
            password: 'some password',
            email_confirmation: false,
            created_at: created_at.toISOString(),
          },
        ],
      });
    });
  });
});
