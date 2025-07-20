import { Controller, Get } from '@nestjs/common';
import { HttpServiceOneService } from './http-service-one.service';

@Controller()
export class HttpServiceOneController {
  constructor(private readonly HttpServiceOneService: HttpServiceOneService) {}

  @Get()
  getHello(): string {
    return this.HttpServiceOneService.getHello();
  }
}
