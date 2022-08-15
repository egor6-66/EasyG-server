import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserRoles } from '../intermediate-tables/user-roles.model';
import { User } from './users.model';
import { Role } from '../roles/roles.model';

import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([
    User,
    Role,
    UserRoles,
  ]),
    forwardRef(() => AuthModule),
    RolesModule,
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule {
}
