import { tracer } from '@nestjs-distributed-tracing/helpers';
tracer({ serviceName: 'http-service-one' });

import { NestFactory } from '@nestjs/core';
import { HttpServiceOneModule } from './http-service-one.module';

async function bootstrap() {
  const app = await NestFactory.create(HttpServiceOneModule);
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
