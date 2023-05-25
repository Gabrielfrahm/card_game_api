import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JWTAdapter } from 'core/auth/infra';
import { Request, Response, NextFunction } from 'express';

import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheMiddleware implements NestMiddleware {
  constructor(
    @Inject('REDIS')
    private readonly redisClient: Redis,
    @Inject('JWT')
    private readonly jwtAdapter: JWTAdapter,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const routeMethod = req.method;
    let cacheKey: string;
    const checkQuery = Object.keys(req.query);

    const [, token] = req.headers.authorization.split(' ');

    const decoded = this.jwtAdapter.validateToken(token);

    switch (routeMethod) {
      case 'POST':
        if (req.params.userId) {
          cacheKey = `deck:list:${req.params.userId}`;
          await this.redisClient.del(cacheKey);
        }
        break;
      case 'GET':
        if (!req.params.id && req.params.userId && checkQuery.length === 0) {
          cacheKey = `deck:list:${req.params.userId}`;
        }
        if (req.params.id) {
          cacheKey = `deck:${req.params.id}`;
        }
        const checkCache = await this.redisClient.get(cacheKey);
        if (checkCache) {
          return res.json(JSON.parse(checkCache));
        }
        break;
      case 'PUT':
        cacheKey = `deck:${req.params.id}`;
        await this.redisClient.del(cacheKey);
        await this.redisClient.del(`deck:list:${decoded['sub']}`);

        break;
      case 'DELETE':
        cacheKey = `deck:${req.params.id}`;
        await this.redisClient.del(cacheKey);
        await this.redisClient.del(`deck:list:${decoded['sub']}`);
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
        if (!req.params.id && req.params.userId && checkQuery.length === 0) {
          cacheKey = `deck:list:${req.params.userId}`;
        }
        if (req.params.id) {
          cacheKey = `deck:${req.params.id}`;
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
        cacheKey = `deck:${req.params.id}`;
        await this.redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600);
        break;
      default:
        break;
    }
  }
}
