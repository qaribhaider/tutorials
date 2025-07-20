import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TheServiceThreeService } from './the-service-three.service';

@Controller()
export class TheServiceThreeController {
  constructor(
    private readonly theServiceThreeService: TheServiceThreeService,
  ) {}

  @MessagePattern('request_response_v2')
  requestResponse(): string {
    return this.theServiceThreeService.requestResponse();
  }

  @MessagePattern('fire_and_forget_v2')
  fireAndForget(): void {
    this.theServiceThreeService.fireAndForget();
  }
}
