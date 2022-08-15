import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { ValidationPipe } from './pipes/validation.pipe';

async function start() {

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT;
  await app.listen(PORT, () =>
    console.log(`Server started on port: ${PORT} 🚀🚀🚀🚀🚀`),
  );

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

}

start();
