import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ROLE } from '@config';
import { ReqUser } from '@modules/kernel';

export interface JwtStrategyParams {
  id: string;
  email: string;
  username: string;
  roles: ROLE[];
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(params: JwtStrategyParams): Promise<ReqUser> {
    return {
      id: params.id,
      email: params.email,
      username: params.username,
      roles: params.roles
    };
  }
}