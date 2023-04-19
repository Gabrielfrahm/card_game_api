import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { shareModule } from './@share/@share.module';

@Module({
  imports: [UsersModule, shareModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
