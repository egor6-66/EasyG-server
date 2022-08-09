import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userDb: typeof User) {}

  async createUser(dto: CreateUserDto) {
    return await this.userDb.create(dto);
  }

  async getAllUsers() {
    return await this.userDb.findAll();
  }
}
