import { Body, Controller, Post, Get, UseInterceptors, ClassSerializerInterceptor, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { AuthService } from './auth.service';


@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/v1/registration')
  async registration(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.registration(dto, res, req);
  }

  @Post('/v1/login')
  login(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.login(dto, res, req);
  }

  @Get('/v1/logout')
  logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.logout(res, req);
  }

  @Get('/v1/refresh')
  refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.refresh(res, req);
  }
}
