export class CreateOrderDto {
  total: number;
  status: string;
  items: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  quantity: number;
  price: number;
  productId: string;
}
