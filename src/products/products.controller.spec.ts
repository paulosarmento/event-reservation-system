import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from 'libs/ecommerce-core/src/products/products.service';
import { PrismaService } from 'libs/prisma/prisma.service';
import { CategoriesService } from 'libs/ecommerce-core/src/categories/categories.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: ProductsService;
  let prismaService: PrismaService;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService, PrismaService, CategoriesService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productsService).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(categoriesService).toBeDefined();
  });
});
