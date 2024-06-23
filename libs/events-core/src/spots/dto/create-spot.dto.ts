import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSpotDto {
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  name: string;
}
