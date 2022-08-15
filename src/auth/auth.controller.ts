import { Body, Controller, Post, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { AuthService } from './auth.service';


@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/v1/registration')
  registration(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }

  @Post('/v1/login')
  login(@Body() dto: CreateUserDto) {
    return this.authService.login(dto);
  }
}
