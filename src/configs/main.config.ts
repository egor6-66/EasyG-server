import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '../pipes/validation.pipe';


export default (app: INestApplication) => {
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
}
