import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@modules/user';

import { AuthController } from './infrastructure/controller/auth.controller';
import { JwtStrategy } from './domain/strategy/jwt.strategy';
import { LocalStrategy } from './domain/strategy/local.strategy';
import { MongoDBAuthRepository } from './infrastructure/persistence/mongodb-auth.repository';
import { LoginJWTService } from './application/login-jwt/login-jwt.service';
import { LoginLocalService } from './application/login-local/login-local.service';
import { RegisterService } from './application/register/register.service';
import { Auth } from './domain/auth';
import { AuthSchema } from './infrastructure/persistence/mongodb-auth.schema';
import { UnregisterService } from './application/unregister/unregister.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [AuthController],
  providers: [
    LoginJWTService,
    LoginLocalService,
    RegisterService,
    UnregisterService,
    JwtStrategy,
    LocalStrategy,
    MongoDBAuthRepository
  ],
  exports: [
    LoginJWTService,
    RegisterService,
    UnregisterService
  ]
})

export class AuthModule { }
