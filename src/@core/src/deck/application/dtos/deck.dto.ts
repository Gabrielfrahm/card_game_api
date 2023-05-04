import { Card, User } from "@prisma/client";

export type DeckOutput = {
  id: string;
  name: string;
  user: User;
  cards: Card[];
  main_card: Card;
  created_at: Date;
};
