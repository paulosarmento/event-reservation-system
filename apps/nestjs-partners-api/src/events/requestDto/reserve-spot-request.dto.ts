import { TicketKind } from '@prisma/client';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ReserveSpotRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  spots: string[];

  @IsNotEmpty()
  @IsEnum(TicketKind)
  ticket_kind: TicketKind;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
