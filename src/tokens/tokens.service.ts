import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { User } from '../users/users.model';
import { Token } from './tokens.model';

import JwtException from '../exceptions/jwt.exception';
import HeadersException from '../exceptions/headers.exception';


@Injectable()
export class TokensService {
  accessKey = process.env.JWT_ACCESS_KEY;
  refreshKey = process.env.JWT_REFRESH_KEY;
  accessMaxAge = process.env.JWT_ACCESS_MAX_AGE;
  refreshMaxAge = process.env.JWT_REFRESH_MAX_AGE;

  constructor(@InjectModel(Token)
              private tokenRepo: typeof Token) {
  }

  async generateTokens(user: User) {
    const payload = JwtException(user);
    const accessToken = jwt.sign(payload, this.accessKey, { expiresIn: this.accessMaxAge + 'm' });
    const refreshToken = jwt.sign(payload, this.refreshKey, { expiresIn: this.refreshMaxAge + 'd' });
    return { accessToken, refreshToken };
  }

  async saveTokenInCookie(response, refreshToken) {
    response.cookie('refreshToken', refreshToken, {
      maxAge: +this.refreshMaxAge * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
  }

  async saveTokenInDb(req, refreshToken, userId, tokens = []) {
    const sessionInfo = HeadersException(req, 'session-info');
    const token = tokens.find(token => token.device === sessionInfo.device);
    if (token) {
      await token.update({ ...sessionInfo, refreshToken, userId });
    } else {
      await this.tokenRepo.create({ ...sessionInfo, refreshToken, userId });
    }
  }

  async removeTokenInDb(refreshToken) {
    return await this.tokenRepo.destroy({ where: { refreshToken } });
  }

  async removeAllOldTokensInDb() {
    await this.tokenRepo.destroy({
      where: {
        createdAt: { [Op.lte]: moment().subtract(+this.refreshMaxAge, 'days').toDate() },
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
