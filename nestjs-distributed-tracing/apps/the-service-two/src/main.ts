import { tracer } from '@nestjs-distributed-tracing/helpers';
tracer({ serviceName: 'the-service-two' });

import { NestFactory } from '@nestjs/core';
import { TheServiceTwoModule } from './the-service-two.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Create a microservice application that listens on TCP
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TheServiceTwoModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://dt-rabbitmq:5672'],
        queue: 'service_two_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
  Logger.log('Service Two Microservice started');
}
bootstrap();
