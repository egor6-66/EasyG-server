import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { AddRoleDto } from './dto/add-role.dto';

import { UsersService } from './users.service';

import { Roles } from '../roles/roles.decorator';

import { RolesGuard } from '../roles/roles.guards';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post('/addRole')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }
}
