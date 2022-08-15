import { ClassSerializerInterceptor, Module, UseInterceptors } from '@nestjs/common';

import envConfig from './configs/env.config';
import postgresConfig from './configs/postgres.config';

import { UserRoles } from './intermediate-tables/user-roles.model';
import { User } from './users/users.model';
import { Role } from './roles/roles.model';
import { Token } from './tokens/tokens.model';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';


@Module({
  controllers: [],
  providers: [],
  imports: [
    envConfig,
    postgresConfig([
      User,
      Role,
      UserRoles,
      Token,
    ]),
    UsersModule,
    RolesModule,
    AuthModule],
})
export class AppModule {
}
