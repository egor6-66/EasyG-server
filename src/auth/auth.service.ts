import { HttpException, HttpStatus, Injectable, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { User } from '../users/users.model';

import { UsersService } from '../users/users.service';

import JwtException from '../exceptions/jwt.exception';


@Injectable()
export class AuthService {

  constructor(private userService: UsersService,
              private jwtService: JwtService) {
  }

  async registration(dto: CreateUserDto) {
    try {
      const hashedPass = await bcrypt.hash(dto.password, 5);
      const user = await this.userService.createUser({ ...dto, password: hashedPass });
      const { accessToken } = await this.generateTokens(user);
      return { accessToken };
    } catch (e) {
      throw new HttpException('this email is already registered', HttpStatus.BAD_REQUEST);
    }
  }

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    const { accessToken } = await this.generateTokens(user);
    return { accessToken };
  }


  private async generateTokens(user: User) {
    const payload = JwtException(user);
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);
    return { accessToken, refreshToken };
  }

  private async validateUser(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (user && await bcrypt.compare(dto.password, user.password)) {
      return user;
    } else {
      throw  new UnauthorizedException({ message: 'incorrect data' });
    }
  }
}
