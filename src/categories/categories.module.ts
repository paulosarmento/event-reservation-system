import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesCoreModule } from '@app/ecommerce-core';

@Module({
  imports: [CategoriesCoreModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
