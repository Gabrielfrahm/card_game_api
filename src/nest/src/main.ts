import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  applyGlobalConfig(app);
  app.setGlobalPrefix('/v1/api');
  app.enableCors();
  await app.listen(3333);
}
bootstrap();
