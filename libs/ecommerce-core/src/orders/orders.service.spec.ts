import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from 'libs/prisma/prisma.service';

describe('OrdersService', () => {
  let useCase: OrdersService;
  let prismaServiceMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, PrismaService],
    }).compile();

    useCase = module.get<OrdersService>(OrdersService);
    prismaServiceMock = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prismaServiceMock).toBeDefined();
  });
});
