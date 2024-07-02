import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from 'libs/events-core/src/events/events.service';
import { CreateEventRequestDto } from './requestDto/create-event-request.dto';
import { UpdateEventRequestDto } from './requestDto/update-event-request.dto';
import { ReserveSpotRequestDto } from './requestDto/reserve-spot-request.dto';
import { AuthGuard } from 'libs/events-core/src/auth/auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventRequestDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventRequestDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
  @UseGuards(AuthGuard)
  @Post(':id/reserve')
  reserveSpots(
    @Body() reserveRequestDto: ReserveSpotRequestDto,
    @Param('id') eventId: string,
  ) {
    return this.eventsService.reserveSpot({ ...reserveRequestDto, eventId });
  }
}
