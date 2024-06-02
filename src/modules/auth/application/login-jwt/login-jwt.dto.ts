import { IsEmail, IsNotEmpty } from 'class-validator';
import { LoginJWTServiceParams } from './login-jwt.service';

export class LoginJWTDto implements LoginJWTServiceParams {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}