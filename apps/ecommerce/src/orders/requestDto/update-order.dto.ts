import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderRequestDto } from './create-order.dto';

export class UpdateOrderRequestDto extends PartialType(CreateOrderRequestDto) {
  status: string;
}
