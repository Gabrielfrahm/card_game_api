import { AuthOutput } from 'core/auth/application';

export class AuthPresenter {
  user: {
    id: string;
    email: string;
    name: string;
    email_confirmation: boolean;
  };
  token: string;

  constructor(output: AuthOutput) {
    this.user = output.user;
    this.token = output.token;
  }
}
