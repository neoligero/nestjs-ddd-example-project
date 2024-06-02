import { IsAlphanumeric, IsEmail, IsOptional, Length } from 'class-validator';
import { SearchUserServiceParams } from './search-user.service';

export class SearchUserDto implements SearchUserServiceParams {
  @IsOptional()
  @Length(2, 16)
  @IsAlphanumeric()
  readonly username: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;
}