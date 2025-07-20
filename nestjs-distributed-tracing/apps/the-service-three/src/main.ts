import { tracer } from '@nestjs-distributed-tracing/helpers';
tracer({ serviceName: 'the-service-three' });

import { NestFactory } from '@nestjs/core';
import { TheServiceThreeModule } from './the-service-three.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Create a microservice application that listens on TCP
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TheServiceThreeModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://dt-rabbitmq:5672'],
        queue: 'service_three_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
  Logger.log('Service Three Microservice is listening on port 3002');
}
bootstrap();
