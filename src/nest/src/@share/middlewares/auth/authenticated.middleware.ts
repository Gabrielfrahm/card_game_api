import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JWTError } from 'core/@seedwork/domain';
import { JWTAdapter } from 'core/auth/infra';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthenticatedMiddleware implements NestMiddleware {
  constructor(
    @Inject('JWT')
    private readonly jwtAdapter: JWTAdapter,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new JWTError('JWT token is Missing');
    }

    const [, token] = authHeader.split(' ');

    this.jwtAdapter.validateToken(token);

    next();
  }
}
