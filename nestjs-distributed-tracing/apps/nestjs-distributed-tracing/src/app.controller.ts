import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return `Hello from the main application!`;
  }

  @Get('request-response')
  async requestResponse(): Promise<string> {
    return this.appService.requestResponse();
  }

  @Get('fire-and-forget')
  fireAndForget(): string {
    return this.appService.fireAndForget();
  }

  @Get('outside-call')
  async outsideCall(): Promise<string> {
    return this.appService.outsideCall();
  }
}
