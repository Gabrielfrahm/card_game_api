import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis(
          Number(process.env.REDIS_PORT),
          process.env.REDIS_HOST,
        );
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
