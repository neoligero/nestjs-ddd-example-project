import { IsAlphanumeric, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { RegisterServiceParams } from './register.service';

export class RegisterDto implements Omit<RegisterServiceParams, "roles"> {
  @IsNotEmpty()
  @Length(2, 16)
  @IsAlphanumeric()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Length(8, 64)
  readonly password: string;
}