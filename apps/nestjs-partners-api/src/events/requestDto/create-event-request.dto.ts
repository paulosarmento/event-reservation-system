import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEventRequestDto {
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}
