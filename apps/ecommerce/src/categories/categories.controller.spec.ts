import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from 'libs/ecommerce-core/src';
import { PrismaService } from 'libs/prisma/prisma.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, PrismaService],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoriesService).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
