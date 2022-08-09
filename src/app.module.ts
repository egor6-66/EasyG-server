import { Module } from '@nestjs/common';

import envConfig from './configs/env';
import postgresConfig from './configs/postgres';

import { UsersModule } from './users/users.module';

@Module({
  controllers: [],
  providers: [],
  imports: [envConfig, postgresConfig, UsersModule],
})
export class AppModule {}
