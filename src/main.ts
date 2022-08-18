import { NestFactory } from '@nestjs/core';
import mainConfig from './configs/main.config';
import { AppModule } from './app.module';


async function start() {

  const app = await NestFactory.create(AppModule);

  mainConfig(app)

  const PORT = process.env.PORT;
  await app.listen(PORT, () =>
    console.log(`Server started on port: ${PORT} 🚀🚀🚀🚀🚀`),
  );
}

start();
