import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

import { ROLES_KEY } from './roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private authService: AuthService,
              private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) return true;
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization.split(' ')[1];
      // const user = this.jwtService.verify(token);
      // req.user = user;
      // return user.roles.some(role => requiredRoles.includes(role.value));
    } catch (e) {
      throw new HttpException('No access rights', HttpStatus.FORBIDDEN);
    }
  }
}
