import { Module } from '@nestjs/common';
import { EventsCoreModule } from 'libs/events-core/src/events/events-core.module';
import { EventsController } from './events.controller';

@Module({
  imports: [EventsCoreModule],
  controllers: [EventsController],
})
export class EventsAppModule {}
