import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryRequestDto } from './create-category.dto';

export class UpdateCategoryRequestDto extends PartialType(
  CreateCategoryRequestDto,
) {}
