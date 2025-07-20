import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TheServiceTwoController } from './the-service-two.controller';
import { TheServiceTwoService } from './the-service-two.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SERVICE_THREE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://dt-rabbitmq:5672'],
          queue: 'service_three_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [TheServiceTwoController],
  providers: [TheServiceTwoService],
})
export class TheServiceTwoModule {}
