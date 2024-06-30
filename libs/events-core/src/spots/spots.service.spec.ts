import { Test, TestingModule } from '@nestjs/testing';
import { SpotsService } from './spots.service';
import { PrismaService } from 'libs/prisma/prisma.service';

describe('SpotsService', () => {
  let service: SpotsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotsService, PrismaService],
    }).compile();

    service = module.get<SpotsService>(SpotsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
