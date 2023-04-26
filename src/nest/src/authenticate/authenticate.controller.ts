import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { CreateAuthUseCase } from 'core/auth/application';
import { CreateAuthDto } from './dtos/create-auth.dto';

@Controller('authenticate')
export class AuthenticateController {
  @Inject(CreateAuthUseCase.UseCase)
  private createUseCase: CreateAuthUseCase.UseCase;

  @Post()
  @HttpCode(201)
  async create(@Body() createAuthDto: CreateAuthDto) {
    const output = await this.createUseCase.execute(createAuthDto);
    return output;
  }
}
