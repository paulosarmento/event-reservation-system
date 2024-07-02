import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    // Fetch the product details for each item
    const productDetails = await Promise.all(
      items.map((item) =>
        this.prismaService.product.findUnique({
          where: { id: item.productId },
          select: { price: true },
        }),
      ),
    );

    // Calculate the total and construct items data with prices
    let total = 0;
    const itemsData = items.map((item, index) => {
      const product = productDetails[index];
      const itemTotal = item.quantity * product.price;
      total += itemTotal;
      return {
        quantity: item.quantity,
        price: product.price,
        productId: item.productId,
      };
    });

    const createdOrder = await this.prismaService.order.create({
      data: {
        total,
        status: 'PENDING',
        items: {
          create: itemsData,
        },
      },
      include: {
        items: {
          select: {
            price: true,
            quantity: true,
            product: {
              select: {
                description: true,
              },
            },
          },
        },
      },
    });

    return createdOrder;
  }

  findAll() {
    return this.prismaService.order.findMany({
      select: {
        id: true,
        total: true,
        status: true,
        items: {
          select: {
            price: true,
            quantity: true,
            product: {
              select: {
                description: true,
                externalImageURLs: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.order.findUnique({
      where: { id },
      select: {
        id: true,
        total: true,
        status: true,
        items: {
          select: {
            price: true,
            quantity: true,
            product: {
              select: {
                description: true,
                externalImageURLs: {
                  select: {
                    url: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prismaService.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status as any,
      },
    });
  }

  async remove(id: string) {
    await this.prismaService.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    return this.prismaService.order.delete({ where: { id } });
  }
}
