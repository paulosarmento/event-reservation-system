import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { PrismaService } from 'libs/prisma/prisma.service';
import { EventsService } from 'libs/events-core/src';
import { AuthGuard } from 'libs/events-core/src/auth/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importar ConfigModule e ConfigService

describe('EventsController', () => {
  let eventsController: EventsController;
  let prismaService: PrismaService;
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({})],
      controllers: [EventsController],
      providers: [EventsService, PrismaService, AuthGuard, ConfigService],
    }).compile();

    eventsController = module.get<EventsController>(EventsController);
    prismaService = module.get<PrismaService>(PrismaService);
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(eventsController).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(authGuard).toBeDefined();
  });
});
