import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginLocalService } from '../../application/login-local/login-local.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private loginLocalService: LoginLocalService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // If you don*t pass username here, the middleware wont work
    // thats why we rename it to email
    const auth = await this.loginLocalService.invoke({ email: username, password });
    if (!auth) {
      throw new UnauthorizedException();
    }
    return auth;
  }
}