import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'libs/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { productIds, ...categoryData } = createCategoryDto;
    return this.prismaService.category.create({
      data: {
        ...categoryData,
        productCategories: {
          create: productIds?.map((productId) => ({
            productId,
          })),
        },
      },
    });
  }

  findAll() {
    return this.prismaService.category.findMany();
  }

  findOne(id: string) {
    return this.prismaService.category.findUnique({
      where: { id },
      include: {
        productCategories: {
          select: {
            Product: {
              select: {
                code: true,
                description: true,
                price: true,
                situation: true,
                parentCode: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { productIds, ...categoryData } = updateCategoryDto;

    return this.prismaService.category.update({
      where: { id },
      data: {
        ...categoryData,
        productCategories: {
          create: productIds?.map((productId) => ({
            productId,
          })),
        },
      },
    });
  }

  async remove(id: string) {
    try {
      const dependentProducts = await this.prismaService.product.findMany({
        where: {
          productCategories: {
            some: {
              categoryId: id,
            },
          },
        },
      });
      console.log('Dependent products:', dependentProducts);

      for (const product of dependentProducts) {
        await this.prismaService.product.update({
          where: { id: product.id },
          data: {
            productCategories: {
              deleteMany: {
                categoryId: id,
              },
            },
          },
        });
      }

      await this.prismaService.category.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
