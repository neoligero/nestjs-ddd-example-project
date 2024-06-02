import { IsNotEmpty } from 'class-validator';

export class PromoteDto {
  @IsNotEmpty()
  readonly id: string;
}