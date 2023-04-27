export type CardOutput = {
  id: string;
  name: string;
  number: number;
  category: string;
  image_url: string;
  description: string;
  atk: string;
  def: string;
  effect: string;
  main_card: boolean;
  created_at?: Date;
};
