import { Card, CardRepository } from "#card/domain";
import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { CardOutput } from "../dtos";
import CardOutputMapper from "../mappers/card-output.mapper";

export namespace CreateCardUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cardRepository: CardRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = new Card(input);

      await this.cardRepository.insert(entity);
      return CardOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
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

  export type Output = CardOutput;
}

export default CreateCardUseCase;
