import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';

import { User } from './users.model';

import { RolesService } from '../roles/roles.service';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User)
              private userDb: typeof User,
              private roleService: RolesService) {
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.userDb.create(dto);
    const role = await this.roleService.getRoleByValue('ADMIN');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers() {
    return await this.userDb.findAll({ include: { all: true } });
  }

  async getUserByEmail(email: string) {
    return await this.userDb.findOne({ where: { email }, include: { all: true } });
  }

  async addRole(dto: AddRoleDto) {
    try {
      const user = await this.userDb.findByPk(dto.userId);
      const role = await this.roleService.getRoleByValue(dto.value);
      await user.$add('role', role.id);
      return dto;
    } catch (e) {
      throw new HttpException('User or role not found', HttpStatus.NOT_FOUND);
    }
  }
}
