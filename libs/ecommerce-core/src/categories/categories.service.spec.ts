import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'libs/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoriesService', () => {
  let useCase: CategoriesService;
  let prismaServiceMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    useCase = module.get<CategoriesService>(CategoriesService);
    prismaServiceMock = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prismaServiceMock).toBeDefined();
  });

  describe('create method', () => {
    it('should create a category', async () => {
      const mockCategory: CreateCategoryDto = {
        name: '123',
      };

      (prismaServiceMock.category.create as jest.Mock).mockResolvedValue(
        mockCategory,
      );

      const category = await useCase.create({
        name: 'test',
      });

      expect(category).toEqual(mockCategory);
      expect(category.name).toBe('123');
    });
  });

  describe('findAll method', () => {
    it('should find all categories', async () => {
      const mockCategories: CreateCategoryDto[] = [
        {
          name: '123',
        },
        {
          name: '456',
        },
      ];

      (prismaServiceMock.category.findMany as jest.Mock).mockResolvedValue(
        mockCategories,
      );

      const categories = await useCase.findAll();

      expect(categories).toEqual(mockCategories);
      expect(categories.length).toBe(mockCategories.length);
      expect(categories[0].name).toBe('123');
      expect(categories[1].name).toBe('456');
    });
  });
});
