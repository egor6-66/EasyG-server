import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserRoles } from '../intermediate-tables/user-roles.model';
import { Role } from './roles.model';
import { User } from '../users/users.model';

import { RolesController } from './roles.controller';

import { RolesService } from './roles.service';


@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [SequelizeModule.forFeature([
    Role,
    User,
    UserRoles,
  ])],
  exports: [
    RolesService,
  ],
})
export class RolesModule {
}
