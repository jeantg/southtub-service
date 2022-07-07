import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    await app.listen(process.env.PORT || 3333);

    console.log(`Worker ${process.pid} started`);
  }
}
bootstrap();
