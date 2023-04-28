import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { shareModule } from './@share/@share.module';
import { RedisModule } from './redis/redis.module';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [UsersModule, shareModule, RedisModule, AuthenticateModule, CardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
