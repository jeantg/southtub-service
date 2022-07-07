import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { VideoService } from 'src/services/video.service';

@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  findAll(
    @Query('name') name: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.videoService.findAll(name, req, res);
  }
}
