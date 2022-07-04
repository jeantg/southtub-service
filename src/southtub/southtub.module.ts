import { Module } from '@nestjs/common';
import { SouthtubController } from './southtub.controller';
import { SouthtubService } from './southtub.service';

@Module({
  providers: [SouthtubService],
  controllers: [SouthtubController],
})
export class SouthtubModule {}
