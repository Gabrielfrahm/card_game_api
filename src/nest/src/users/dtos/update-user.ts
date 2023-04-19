import { UpdateUserUseCase } from 'core/user/application';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  email_confirmation?: boolean;
}
