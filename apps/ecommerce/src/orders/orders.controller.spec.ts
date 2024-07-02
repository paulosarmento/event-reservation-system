import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from 'libs/ecommerce-core/src/orders/orders.service';
import { PrismaService } from 'libs/prisma/prisma.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let useCase: OrdersService;
  let prismaServiceMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService, PrismaService],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    useCase = module.get<OrdersService>(OrdersService);
    prismaServiceMock = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prismaServiceMock).toBeDefined();
    expect(controller).toBeDefined();
  });
});
