import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSpotRequestDto {
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  name: string;
}
