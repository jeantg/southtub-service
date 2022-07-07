import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { SouthtubService } from './southtub.service';
import { GenerateThumbnail } from './interfaces/thumbnail.interface';

@Controller('southtub')
export class SouthtubController {
  constructor(private southtubService: SouthtubService) {}

  @Get('/generate-thumbnail')
  async generateThumbnail(
    @Query('filename') filename: string,
  ): Promise<GenerateThumbnail | void> {
    return this.southtubService.generateThumbnail(filename);
  }

  @Get('/thumbnail')
  async getThumbnail(
    @Query('filename') filename: string,
  ): Promise<StreamableFile> {
    return this.southtubService.getThumbnail(filename);
  }
}
