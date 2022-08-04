import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile
} from '@nestjs/common';
import { createReadStream, rmSync } from 'fs';
import * as moment from 'moment';
import { join } from 'path';
var ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const mergeImages = require('merge-images');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { Canvas, Image } = require('canvas');
const targetDuration = moment.duration('00:00:00');

@Injectable()
export class SouthtubService {
  async generateThumbnail(filename) {
    const caminho = join(process.cwd(), `videos/${filename}.mp4`);

    if (!fs.existsSync(caminho)) {
      throw new HttpException(
        'Arquivo não encontrado - Tente novamente',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.generateThumb(caminho, filename);
    return {
      status: 'Vídeo sendo processado',
    };
  }

  generateThumb = async (caminho, filename) => {
    await getVideoDurationInSeconds(caminho).then((duration) => {
      const durationLocal = Math.floor(duration / 60);
      console.log('durationLocaldurationLocal', durationLocal);
      fs.mkdirSync(join(process.cwd(), `/content/final/${filename}`), {
        recursive: true,
      });

      for (
        let currentMatrice = 0;
        currentMatrice < durationLocal;
        currentMatrice++
      ) {
        fs.mkdirSync(
          join(process.cwd(), `/content/thumbnail_${currentMatrice}`),
          { recursive: true },
        );
        const currentDirectory = join(
          process.cwd(),
          `/content/thumbnail_${currentMatrice}`,
        );
        const timestamps = Array.from(Array(12).keys()).map(() =>
          moment
            .utc(targetDuration.add(5, 'seconds').as('milliseconds'))
            .format('HH:mm:ss'),
        );
        new ffmpeg(caminho)
          .screenshots({
            size: `250x250`,
            timestamps,
            folder: currentDirectory,
          })
          .on('start', () => {
            console.time(`ffmpeg${currentMatrice}`);
          })
          .on('error', function (err) {
            console.log('ERRO: ' + err.message);
          })
          .on('end', async () => {
            let files = [];
            for (let i = 0; i < 2; i++) {
              for (let j = 1; j <= 6; j++) {
                let indexFix;
                i === 0 ? (indexFix = j) : (indexFix = j + 6);
                files.push({
                  src: `${currentDirectory}/tn_${indexFix}.png`,
                  x: (j - 1) * 250,
                  y: i * 250,
                });
              }
            }

            mergeImages(files, {
              width: 1500,
              height: 500,
              Canvas: Canvas,
              Image: Image,
            }).then((b64) => {
              const teste = b64.replace(/^data:image\/png;base64,/, '');
              fs.writeFileSync(
                join(
                  process.cwd(),
                  `/content/final/${filename}/final_${currentMatrice + 1}.png`,
                ),
                teste,
                { encoding: 'base64' },
              );

              rmSync(currentDirectory, {
                force: true,
                recursive: true,
              });
              console.timeEnd(`ffmpeg${currentMatrice}`);
            });
          });
      }
    });
  };

  async getThumbnail(filename) {
    const path = join(process.cwd() + `/content/final/${filename}`);
    const fileFirst = join(
      process.cwd() + `/content/final/${filename}/final_1.png`,
    );
    if (!fs.existsSync(path) && !fs.existsSync(fileFirst)) {
      throw new HttpException('Arquivo não encontrado', HttpStatus.NOT_FOUND);
    }
    /* const thumbArray = [];
    fs.readdirSync(path).forEach((file) => {
      thumbArray.push(
        createReadStream(
          join(process.cwd() + `/content/final/${filename}/${file}`),
        ),
      );
    });
    return thumbArray; */
    const fileSample = createReadStream(fileFirst);
    return new StreamableFile(fileSample);
  }
}
