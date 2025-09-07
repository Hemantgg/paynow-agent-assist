import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

export class RequestContextMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    (req as any).requestId = req.headers['x-request-id'] || `req_${randomUUID()}`;
    next();
  }
}
