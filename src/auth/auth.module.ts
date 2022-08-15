import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../users/users.model';
import { Token } from './auth.model';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([
      Token,
      User,
    ]),
    forwardRef(() => UsersModule),
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {
}
