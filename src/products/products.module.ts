import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsCoreModule } from '@app/ecommerce-core';

@Module({
  imports: [ProductsCoreModule],
  controllers: [ProductsController],
})
export class ProductsModule {}
