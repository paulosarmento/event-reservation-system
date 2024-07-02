import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [CategoriesModule, OrdersModule, ProductsModule],
})
export class EcommerceModule {}
