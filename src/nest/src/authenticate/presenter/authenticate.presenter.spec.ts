import { instanceToPlain } from 'class-transformer';
import { AuthPresenter } from './authenticate.presenter';

describe('auth presenter unit test', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const presenter = new AuthPresenter({
        user: {
          id: 'd83a0533-5098-463c-8519-fe51864a6c05',
          email: 'some@mail.com',
          name: 'some name',
          email_confirmation: false,
        },
        token: 'some token',
      });
      expect(presenter.user).toStrictEqual({
        id: 'd83a0533-5098-463c-8519-fe51864a6c05',
        email: 'some@mail.com',
        name: 'some name',
        email_confirmation: false,
      });
      expect(presenter.token).toBe('some token');
    });

    it('should presenter data', () => {
      const presenter = new AuthPresenter({
        user: {
          id: 'd83a0533-5098-463c-8519-fe51864a6c05',
          email: 'some@mail.com',
          name: 'some name',
          email_confirmation: false,
        },
        token: 'some token',
      });
      const data = instanceToPlain(presenter);

      expect(data).toStrictEqual({
        user: {
          id: 'd83a0533-5098-463c-8519-fe51864a6c05',
          email: 'some@mail.com',
          name: 'some name',
          email_confirmation: false,
        },
        token: 'some token',
      });
    });
  });
});
