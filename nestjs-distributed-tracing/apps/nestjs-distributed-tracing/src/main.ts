import { tracer } from '@nestjs-distributed-tracing/helpers';
tracer({ serviceName: 'nestjs-distributed-tracing' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Create a standard HTTP application
  const app = await NestFactory.create(AppModule);

  // Listen on HTTP port
  await app.listen(process.env.PORT ?? 3000);

  Logger.log(`Main application is running on: ${await app.getUrl()}`);
}
bootstrap();
