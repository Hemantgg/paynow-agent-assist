import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { redactCustomerId } from './pii.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const rid = (req as any).requestId;
    const start = Date.now();
    const safeBody = { ...req.body, customerId: redactCustomerId(req.body?.customerId) };
    console.log(JSON.stringify({ level: 'info', rid, msg: 'request', path: req.url, body: safeBody }));
    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        console.log(JSON.stringify({ level: 'info', rid, msg: 'response', path: req.url, ms }));
      })
    );
  }
}
