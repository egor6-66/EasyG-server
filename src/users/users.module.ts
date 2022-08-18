import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserRoles } from '../intermediate-tables/user-roles.model';
import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { Token } from '../tokens/tokens.model';

import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { TokensModule } from '../tokens/tokens.module';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([
    User,
    Role,
    UserRoles,
    Token,
  ]),
    forwardRef(() => AuthModule),
    RolesModule,
    TokensModule,
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule {
}
