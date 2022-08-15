import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization.split(' ')[1];
      req.user = this.jwtService.verify(token);
      console.log(req.user);
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
