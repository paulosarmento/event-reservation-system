import { Test, TestingModule } from '@nestjs/testing';
import { SpotsController } from './spots.controller';
import { SpotsService } from 'libs/events-core/src/spots/spots.service';
import { PrismaService } from 'libs/prisma/prisma.service';

describe('SpotsController', () => {
  let controller: SpotsController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotsController],
      providers: [SpotsService, PrismaService],
    }).compile();

    controller = module.get<SpotsController>(SpotsController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
