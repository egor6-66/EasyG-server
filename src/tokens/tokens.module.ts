import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../users/users.model';
import { Token } from './tokens.model';

import { UsersModule } from '../users/users.module';

import { TokensService } from './tokens.service';


@Module({
  controllers: [],
  providers: [TokensService],
  imports: [
    SequelizeModule.forFeature([
      Token,
    ]),
  ],
  exports: [
    TokensService,
  ],
})
export class TokensModule {
}
