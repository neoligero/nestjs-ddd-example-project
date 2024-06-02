import { IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, Length, MaxLength } from 'class-validator';
import { Optional } from '@nestjs/common';
import { CreateUserServiceParams } from './create-user.service';

export class CreateUserDto implements CreateUserServiceParams {
  @IsNotEmpty()
  @Length(2, 16)
  @IsAlphanumeric()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Length(8, 64)
  readonly password: string;

  @IsOptional()
  @MaxLength(255)
  readonly description: string;
}