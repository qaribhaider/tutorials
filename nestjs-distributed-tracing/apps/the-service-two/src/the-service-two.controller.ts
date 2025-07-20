import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TheServiceTwoService } from './the-service-two.service';

@Controller()
export class TheServiceTwoController {
  constructor(private readonly theServiceTwoService: TheServiceTwoService) {}

  @MessagePattern('request_response')
  async requestResponse(): Promise<string> {
    return await this.theServiceTwoService.requestResponse();
  }

  @MessagePattern('fire_and_forget')
  fireAndForget(): void {
    this.theServiceTwoService.fireAndForget();
  }
}
