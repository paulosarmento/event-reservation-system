export class CreateOrderRequestDto {
  total: number;
  status: string;
  items: CreateOrderItemRequestDto[];
}

export class CreateOrderItemRequestDto {
  quantity: number;
  price: number;
  productId: string;
}
