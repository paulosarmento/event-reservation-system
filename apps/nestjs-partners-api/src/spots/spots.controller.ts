import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SpotsService } from 'libs/events-core/src/spots/spots.service';
import { CreateSpotRequestDto } from './requestDto/create-spot-request.dto';
import { UpdateSpotRequestDto } from './requestDto/update-spot-request.dto';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Body() createSpotRequestDto: CreateSpotRequestDto,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.create({
      ...createSpotRequestDto,
      eventId,
    });
  }

  @Get('')
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.findOne(eventId, spotId);
  }

  @Patch(':spotId')
  update(
    @Param('spotId') spotId: string,
    @Body() updateSpotRequestDto: UpdateSpotRequestDto,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.update(eventId, spotId, updateSpotRequestDto);
  }

  @Delete(':spotId')
  remove(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.remove(eventId, spotId);
  }
}
