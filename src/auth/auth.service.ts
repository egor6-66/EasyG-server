import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';


@Injectable()
export class AuthService {
  refreshKey = process.env.JWT_REFRESH_KEY;

  constructor(private tokenService: TokensService,
              private userService: UsersService) {
  }

  async registration(dto: CreateUserDto, res: Response, req: Request) {
    try {
      const hashedPass = await bcrypt.hash(dto.password, 5);
      const user = await this.userService.createUser({ ...dto, password: hashedPass });
      const { accessToken, refreshToken } = await this.tokenService.generateTokens(user);
      await this.tokenService.saveTokenInCookie(res, refreshToken);
      await this.tokenService.saveTokenInDb(req, refreshToken, user.id, user.tokens);
      return { accessToken };
    } catch (e) {
      throw new HttpException('this email is already registered', HttpStatus.BAD_REQUEST);
    }
  }

  async login(dto: CreateUserDto, res: Response, req: Request) {
    await this.tokenService.removeAllOldTokensInDb();
    const user = await this.userService.getUserByEmail(dto.email);
    if (user && await bcrypt.compare(dto.password, user.password)) {
      const { accessToken, refreshToken } = await this.tokenService.generateTokens(user);
      await this.tokenService.saveTokenInCookie(res, refreshToken);
      await this.tokenService.saveTokenInDb(req, refreshToken, user.id, user.tokens);
      return { accessToken };
    } else {
      throw  new UnauthorizedException({ message: 'incorrect data' });
    }
  }

  async logout(res: Response, req: Request) {
    res.clearCookie('refreshToken');
    const { refreshToken } = req.cookies;
    return await this.tokenService.removeTokenInDb(refreshToken);
  }

  async refresh(res: Response, req: Request) {
    const verify: any = await this.tokenService.validateToken(req.cookies.refreshToken, this.refreshKey);
    const user = await this.userService.getUserByEmail(verify.email);
    const { accessToken, refreshToken } = await this.tokenService.generateTokens(user);
    await this.tokenService.saveTokenInCookie(res, refreshToken);
    await this.tokenService.saveTokenInDb(req, refreshToken, user.id, user.tokens);
    return { accessToken };
  }
}
