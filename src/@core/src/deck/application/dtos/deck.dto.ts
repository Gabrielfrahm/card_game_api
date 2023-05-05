import { Card, User } from "@prisma/client";

export interface UserOmit extends Omit<User, "updated_at"> {}
export interface CardOmit extends Omit<Card, "updated_at"> {}

export type DeckOutput = {
  id: string;
  name: string;
  user: UserOmit;
  cards?: CardOmit[];
  main_card?: CardOmit;
  created_at?: Date;
};
