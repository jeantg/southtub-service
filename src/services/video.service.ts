import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { statSync, createReadStream } from 'fs';

@Injectable()
export class VideoService {
  private readonly videos = [];

  findAll(name: string, req: Request, res: Response) {
    const range = req.headers.range;
    if (!range) {
      res.status(400).send('Requires Range header');
    }
    const videoPath = `./src/videos/${name}.mp4`;
    const videoSize = statSync(`./src/videos/${name}.mp4`).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    res.set({
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    });
    const videoStream = createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  }
}
