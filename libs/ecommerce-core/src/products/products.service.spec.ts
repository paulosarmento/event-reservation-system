import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'libs/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let prismaServiceMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    prismaServiceMock = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
    expect(prismaServiceMock).toBeDefined();
  });

  describe('create method', () => {
    it('should create a product', async () => {
      const mockProduct: CreateProductDto = {
        id: '1',
        code: '123',
        description: 'test',
        price: 1,
        situation: 'active',
        parentCode: null,
      };

      (prismaServiceMock.product.create as jest.Mock).mockResolvedValue(
        mockProduct,
      );

      const product = await productsService.create({});

      expect(product).toEqual(mockProduct);
      expect(product.code).toBe('123');
      expect(product.description).toBe('test');
      expect(product.price).toBe(1);
      expect(product.situation).toBe('active');
      expect(product.parentCode).toBeNull();
    });
  });

  describe('findAllParents method', () => {
    it('should find all products', async () => {
      const mockProducts: CreateProductDto[] = [
        {
          id: '1',
          code: '123',
          description: 'test',
          price: 1,
          situation: 'active',
          parentCode: null,
        },
        {
          id: '2',
          code: '456',
          description: 'another test',
          price: 2,
          situation: 'inactive',
          parentCode: null,
        },
      ];

      (prismaServiceMock.product.findMany as jest.Mock).mockResolvedValue(
        mockProducts,
      );

      const products = await productsService.findAllParents();

      expect(products).toEqual(mockProducts);
      expect(products.length).toBe(mockProducts.length);
      expect(products[0].code).toBe('123');
      expect(products[1].code).toBe('456');
    });
  });
});
