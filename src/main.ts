import {NestFactory} from "@nestjs/core";

import swaggerConfig from './configs/swagger'

import { AppModule } from "./app.module";


async function start() {
    const app = await NestFactory.create(AppModule)

    const PORT = process.env.PORT
    console.log(process.env.PORT);
    swaggerConfig(app)

    await app.listen(PORT, ()=> console.log(`Server started on port: ${PORT} 🚀🚀🚀🚀🚀`))
}

start();
