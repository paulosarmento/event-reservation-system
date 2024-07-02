import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsCoreModule } from 'libs/ecommerce-core/src';

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
