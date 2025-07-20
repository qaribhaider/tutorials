import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TheServiceThreeService {
  requestResponse(): string {
    Logger.log(
      `Completed requestResponse processing`,
      'TheServiceThreeService',
    );

    return 'Hello from Service Three Microservice!';
  }

  fireAndForget(): void {
    Logger.log(`Completed fireAndForget processing`, 'TheServiceThreeService');
  }
}
