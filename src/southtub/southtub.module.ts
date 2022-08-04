import { Module } from '@nestjs/common';
import { SouthtubController } from './southtub.controller';
import { SouthtubService } from './southtub.service';

@Module({
  controllers: [SouthtubController],
  providers: [SouthtubService]
})
export class SouthtubModule {}
