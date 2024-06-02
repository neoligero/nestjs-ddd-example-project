import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt";
import { MongoDBAuthRepository } from '../../infrastructure/persistence/mongodb-auth.repository';
import { LoginJWTResponse } from 'types/login-jwt.type';

export interface LoginJWTServiceParams {
  email: string;
  password: string;
}

@Injectable()
export class LoginJWTService {
  constructor(
    private authRepository: MongoDBAuthRepository,
    private jwtService: JwtService
  ) { }

  async invoke(params: LoginJWTServiceParams): Promise<LoginJWTResponse> {
    const auth = await this.authRepository.findOne({ email: params.email });
    if (!auth || !await bcrypt.compare(params.password, auth.toPrimitives().password)) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: auth.toPrimitives().id,
      email: auth.toPrimitives().email,
      username: auth.toPrimitives().username,
      roles: auth.toPrimitives().roles
    };
    return {
      auth_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
    };
  }
}