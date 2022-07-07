import { Controller, Get } from '@nestjs/common';
import { SouthtubService } from './southtub.service';

@Controller('southtub')
export class SouthtubController {
  constructor(private southtubService: SouthtubService) {}

  @Get('/thumbnail')
  async thumbnail() {
    return this.southtubService.thumbnail();
  }
}
