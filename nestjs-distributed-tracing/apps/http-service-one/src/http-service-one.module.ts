import { Module } from '@nestjs/common';
import { HttpServiceOneController } from './http-service-one.controller';
import { HttpServiceOneService } from './http-service-one.service';

@Module({
  imports: [],
  controllers: [HttpServiceOneController],
  providers: [HttpServiceOneService],
})
export class HttpServiceOneModule {}
