import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsCoreModule } from '@app/ecommerce-core';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ProductsCoreModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
