import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { User } from '../users/users.model';
import { Token } from './auth.model';

import { UsersService } from '../users/users.service';

import JwtException from '../exceptions/jwt.exception';
import HeadersException from '../exceptions/headers.exception';


@Injectable()
export class AuthService {

  constructor(@InjectModel(Token)
              private tokenRepo: typeof Token,
              private userService: UsersService) {
  }

  async registration(dto: CreateUserDto, res: Response, req: Request) {
    try {
      const hashedPass = await bcrypt.hash(dto.password, 5);
      const user = await this.userService.createUser({ ...dto, password: hashedPass });
      const { accessToken, refreshToken } = await this.generateTokens(user);
      await this.saveTokenInCookie(res, refreshToken);
      await this.saveTokensInDb(req, refreshToken, user.id, user.tokens);
      return { accessToken };
    } catch (e) {
      throw new HttpException('this email is already registered', HttpStatus.BAD_REQUEST);
    }
  }

  async login(dto: CreateUserDto, res: Response, req: Request) {
    await this.removeOldTokensInDb();
    const user = await this.userService.getUserByEmail(dto.email);
    if (user && await bcrypt.compare(dto.password, user.password)) {
      const { accessToken, refreshToken } = await this.generateTokens(user);
      await this.saveTokenInCookie(res, refreshToken);
      await this.saveTokensInDb(req, refreshToken, user.id, user.tokens);
      return { accessToken };
    } else {
      throw  new UnauthorizedException({ message: 'incorrect data' });
    }
  }

  async logout(res: Response, req: Request) {
    res.clearCookie('refreshToken');
    const { refreshToken } = req.cookies;
    return await this.tokenRepo.destroy({ where: { refreshToken } });
  }

  async refresh(res: Response, req: Request) {
    const verify: any = await this.validateToken(req.cookies.refreshToken, process.env.JWT_REFRESH_KEY);
    const user = await this.userService.getUserByEmail(verify.email);
    const { accessToken, refreshToken } = await this.generateTokens(user);
    await this.saveTokenInCookie(res, refreshToken);
    await this.saveTokensInDb(req, refreshToken, user.id, user.tokens);
    return { accessToken };
  }

  async generateTokens(user: User) {
    const payload = JwtException(user);
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: process.env.JWT_ACCESS_MAX_AGE + 's' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: process.env.JWT_REFRESH_MAX_AGE + 'd' });
    return { accessToken, refreshToken };
  }

  async saveTokenInCookie(response, refreshToken) {
    response.cookie('refreshToken', refreshToken, {
      maxAge: +process.env.JWT_REFRESH_MAX_AGE * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
  }

  async saveTokensInDb(req, refreshToken, userId, tokens) {
    const sessionInfo = HeadersException(req, 'session-info');
    const token = tokens.find(token => token.device === sessionInfo.device);
    if (token) {
      await token.update({ ...sessionInfo, refreshToken, userId });
    } else {
      await this.tokenRepo.create({ ...sessionInfo, refreshToken, userId });
    }
  }

  async removeOldTokensInDb() {
    await this.tokenRepo.destroy({
      where: {
        createdAt: { [Op.lte]: moment().subtract(+process.env.JWT_REFRESH_MAX_AGE, 'days').toDate() },
      },
    });
  }

  validateToken(token, key) {
    try {
      return jwt.verify(token, key);
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
