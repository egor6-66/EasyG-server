import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { TokensService } from '../tokens/tokens.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private tokenService: TokensService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization.split(' ')[1];
      const verify = this.tokenService.validateToken(token, process.env.JWT_ACCESS_KEY)
      req.user = verify;
      return !!verify;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
