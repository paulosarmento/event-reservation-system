import { Module } from '@nestjs/common';
import { SpotsModule } from './spots/spots.module';
import { EventsAppModule } from './events/events.module';

@Module({
  imports: [EventsAppModule, SpotsModule],
})
export class EventsModule {}
