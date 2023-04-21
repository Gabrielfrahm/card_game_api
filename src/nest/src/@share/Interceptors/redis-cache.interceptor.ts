import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisCacheMiddleware } from '../middlewares/redis.middleware';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(private readonly redisCacheMiddleware: RedisCacheMiddleware) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap((data) => {
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        this.redisCacheMiddleware.after(req, res, data);
      }),
    );
  }
}
