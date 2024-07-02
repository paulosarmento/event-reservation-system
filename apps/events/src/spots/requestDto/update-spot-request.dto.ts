import { PartialType } from '@nestjs/mapped-types';
import { CreateSpotRequestDto } from './create-spot-request.dto';

export class UpdateSpotRequestDto extends PartialType(CreateSpotRequestDto) {}
