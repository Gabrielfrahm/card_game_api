import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheMiddleware implements NestMiddleware {
  constructor(
    @Inject('REDIS')
    private readonly redisClient: Redis,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const routeMethod = req.method;
    let cacheKey: string;
    const checkQuery = Object.keys(req.query);

    switch (routeMethod) {
      case 'POST':
        cacheKey = `user:list`;
        await this.redisClient.del(cacheKey);
        break;
      case 'GET':
        if (!req.params.id && checkQuery.length === 0) {
          cacheKey = `user:list`;
        }
        if (req.params.id) {
          cacheKey = `user:${req.params.id}`;
        }
        const checkCache = await this.redisClient.get(cacheKey);
        if (checkCache) {
          return res.json(JSON.parse(checkCache));
        }
        break;
      case 'PUT':
        cacheKey = `user:${req.params.id}`;
        await this.redisClient.del(cacheKey);
        await this.redisClient.del(`user:list`);
        break;
      case 'DELETE':
        cacheKey = `user:${req.params.id}`;
        await this.redisClient.del(cacheKey);
        await this.redisClient.del(`user:list`);
        break;
      default:
        break;
    }
    next();
  }

  async after(req: Request, res: Response, data: any) {
    const routeMethod = req.method;
    let cacheKey: string;
    const checkQuery = Object.keys(req.query);

    switch (routeMethod) {
      case 'GET':
        if (!req.params.id && checkQuery.length === 0) {
          cacheKey = `user:list`;
        }
        if (req.params.id) {
          cacheKey = `user:${req.params.id}`;
        }
        if (cacheKey) {
          await this.redisClient.set(
            cacheKey,
            JSON.stringify(data),
            'EX',
            3600,
          );
        }
        break;
      case 'PUT':
        cacheKey = `user:${req.params.id}`;
        await this.redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
        break;
      default:
        break;
    }
  }
}
