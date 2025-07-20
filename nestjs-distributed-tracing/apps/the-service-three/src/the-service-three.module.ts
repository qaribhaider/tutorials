import { Module } from '@nestjs/common';
import { TheServiceThreeController } from './the-service-three.controller';
import { TheServiceThreeService } from './the-service-three.service';

@Module({
  controllers: [TheServiceThreeController],
  providers: [TheServiceThreeService],
})
export class TheServiceThreeModule {}
