import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheMiddleware implements NestMiddleware {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(6379, 'redis');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const cacheKey = `route:${req.originalUrl}`;
    const checkCache = await this.redisClient.get(cacheKey);

    if (checkCache && req.method === 'GET') {
      return res.json(JSON.parse(checkCache));
    }

    next();
  }

  after(req: Request, res: Response, data: any) {
    console.log(req.baseUrl);
    const key = `route:${req.originalUrl}`;
    this.redisClient.set(key, JSON.stringify(data), 'EX', 3600);
  }
}
