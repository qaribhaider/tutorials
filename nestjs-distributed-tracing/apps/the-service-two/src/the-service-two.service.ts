import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TheServiceTwoService {
  constructor(
    @Inject('SERVICE_THREE') private readonly serviceThreeClient: ClientProxy,
  ) {}

  async requestResponse(): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.serviceThreeClient.send<string>('request_response_v2', {}),
      );
      return `Service Two received from Service Three: ${response}`;
    } catch (error) {
      Logger.error(
        'Error in request-response chain with Service Three:',
        error,
      );
      return 'Error in request-response chain with Service Three';
    }
  }

  fireAndForget(): void {
    try {
      this.serviceThreeClient.emit('fire_and_forget_v2', {});

      Logger.log(
        'Fire-and-forget message sent from Service Two to Service Three',
      );
    } catch (error) {
      Logger.error(
        'Error sending fire-and-forget message to Service Three:',
        error,
      );
    }
  }
}
