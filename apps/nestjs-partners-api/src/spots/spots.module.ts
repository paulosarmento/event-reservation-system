import { Module } from '@nestjs/common';
import { SpotsController } from './spots.controller';
import { SpotsCoreModule } from 'libs/events-core/src/spots/spots-core.module';

@Module({
  imports: [SpotsCoreModule],
  controllers: [SpotsController],
})
export class SpotsModule {}
