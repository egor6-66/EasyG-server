import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../users/users.model';

import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([
      User,
    ]),
    TokensModule,
    forwardRef(() => UsersModule),
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {
}
