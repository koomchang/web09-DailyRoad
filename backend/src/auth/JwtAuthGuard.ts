import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthenticationException } from '@src/auth/exception/AuthenticationException';
import { extractBearerToken } from '@src/auth/util';
import { AuthUser } from '@src/auth/decortator/AuthUser';
import { JWTHelper } from '@src/auth/JWTHelper';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JWTHelper) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractBearerToken(request.headers['authorization']);
    if (!token) {
      throw new AuthenticationException('토큰이 없습니다.');
    }
    try {
      request.user = this.jwtHelper.verifyToken(token) as AuthUser;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AuthenticationException('만료된 토큰입니다.');
      }
      throw new AuthenticationException('유효하지 않은 토큰입니다.');
    }
  }
}
