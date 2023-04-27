import { CardRepository } from "#card/domain";
import { default as DefaultUseCase } from "#seedwork/application/usecase";
import { CardOutput } from "../dtos";
import CardOutputMapper from "../mappers/card-output.mapper";

export namespace GetCardUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cardRepository: CardRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.cardRepository.findById(input.id);
      return CardOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = CardOutput;
}

export default GetCardUseCase;
