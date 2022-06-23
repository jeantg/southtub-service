import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SouthtubModule } from './southtub/southtub.module';

@Module({
  imports: [SouthtubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
