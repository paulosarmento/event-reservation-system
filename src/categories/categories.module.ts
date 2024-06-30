import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesCoreModule } from 'libs/ecommerce-core/src';

@Module({
  imports: [CategoriesCoreModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
