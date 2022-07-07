import { Injectable } from '@nestjs/common';
import { rmSync } from 'fs';
import * as moment from 'moment';
import { join } from 'path';
var ffmpeg = require('fluent-ffmpeg');
const caminho = join(process.cwd(), 'src/content/teste.mp4');
const fs = require('fs');
const mergeImages = require('merge-images');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { Canvas, Image } = require('canvas');
const targetDuration = moment.duration('00:00:00');

@Injectable()
export class SouthtubService {
  async thumbnail() {
    await this.generateThumb();

    return {
      teste: 'teste',
    };
  }

  generateThumb = async () => {
    await getVideoDurationInSeconds(caminho).then((duration) => {
      const durationLocal = Math.floor(duration / 60);
      console.log('durationLocaldurationLocal', durationLocal);
      fs.mkdirSync(join(process.cwd(), `/content/final`), { recursive: true });

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
          /* .on('progress', function (progress) {
            console.log('-------> ' + progress.percent + '% done');
          }) */
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
                  `/content/final/final_${currentMatrice + 1}.png`,
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
}
