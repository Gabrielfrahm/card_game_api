import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalConfig(app);
  app.setGlobalPrefix('/v1/api');
  await app.listen(3333);
}
bootstrap();
