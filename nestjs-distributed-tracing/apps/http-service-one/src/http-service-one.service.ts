import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpServiceOneService {
  getHello(): string {
    return 'Hello World!';
  }
}
