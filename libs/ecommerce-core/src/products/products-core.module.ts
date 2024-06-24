import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsCoreModule {}
