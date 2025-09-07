import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/logging.interceptor';
import { RequestContextMiddleware } from './common/request-context.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });
  app.use(new RequestContextMiddleware().use);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.enableCors({
    origin: "http://localhost:3001", // or "*" for all origins (less secure)
    credentials: true,
  });
  await app.listen(3000);
  console.log('HTTP server listening on http://localhost:3000');
}
bootstrap();
