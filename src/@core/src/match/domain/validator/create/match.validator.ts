import ClassValidatorFields from "#seedwork/domain/validator/class-validator";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MatchProps } from "match/domain/entities/match";

export class MatchRules {
  @IsString()
  @IsNotEmpty()
  host_id: string;

  @IsString()
  @IsOptional()
  participant_id?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  constructor(data: MatchProps) {
    Object.assign(this, data);
  }
}

export class MatchValidator extends ClassValidatorFields<MatchRules> {
  validate(data: MatchRules): boolean {
    return super.validate(new MatchRules(data ?? ({} as any)));
  }
}

export class MatchValidatorFactory {
  static create() {
    return new MatchValidator();
  }
}

export default MatchValidatorFactory;
