import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('SERVICE_TWO') private readonly serviceTwoClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello from the main application!';
  }

  async requestResponse(): Promise<string> {
    try {
      return await firstValueFrom(
        this.serviceTwoClient.send<string>('request_response', {}),
      );
    } catch (error) {
      Logger.error('Error in request-response chain:', error);
      return 'Error in request-response chain';
    }
  }

  fireAndForget(): string {
    try {
      this.serviceTwoClient.emit('fire_and_forget', {});
      return 'Fire-and-forget message sent to Service Two';
    } catch (error) {
      Logger.error('Error sending fire-and-forget message:', error);
      return 'Error sending fire-and-forget message';
    }
  }

  async outsideCall(): Promise<string> {
    try {
      const response = await axios.get<string>(
        'http://host.docker.internal:3003/',
      );
      return response.data;
    } catch (error) {
      // Handle errors
      Logger.error('Error fetching data:', error);
      throw error;
    }
  }
}
