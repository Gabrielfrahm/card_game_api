export type AuthOutput = {
  user: {
    id: string;
    name: string;
    email: string;
    email_confirmation: boolean;
  };
  token: string;
};
