import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { shareModule } from './@share/@share.module';

@Module({
  imports: [UsersModule, ConfigModule, shareModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
