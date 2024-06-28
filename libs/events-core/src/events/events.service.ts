import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { NotFoundError } from '../errors';
import { PrismaService } from 'libs/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}
  async create(createEventDto: CreateEventDto) {
    const currentDate = new Date();
    if (createEventDto.date <= currentDate) {
      throw new BadRequestException('The event date must be a future date');
    }

    return await this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: createEventDto.date,
      },
    });
  }

  async findAll() {
    const events = await this.prismaService.event.findMany();
    if (events.length === 0) {
      throw new NotFoundError('Events not found');
    }

    return events;
  }

  async findOne(id: string) {
    try {
      return await this.prismaService.event.findUniqueOrThrow({
        where: { id: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      await this.prismaService.event.findUniqueOrThrow({
        where: { id: id },
      });

      return await this.prismaService.event.update({
        where: { id: id },
        data: updateEventDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      // Check for reserved spots
      const reservedSpots = await this.prismaService.spot.findMany({
        where: {
          eventId: id,
          status: SpotStatus.reserved,
        },
      });

      if (reservedSpots.length > 0) {
        throw new BadRequestException(
          `Event with ID ${id} has reserved spots and cannot be deleted`,
        );
      }

      // delete all event spots
      await this.prismaService.spot.deleteMany({
        where: {
          eventId: id,
        },
      });
      return await this.prismaService.event.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Event with ID ${id} not found`);
      }
      throw error;
    }
  }

  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: dto.eventId,
        name: {
          in: dto.spots,
        },
      },
    });
    if (spots.length !== dto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsName = dto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new NotFoundError(
        `Spots not exists: ${notFoundSpotsName.join(', ')}`,
      );
    }

    const unavailableSpots = spots.filter(
      (spot) => spot.status !== SpotStatus.available,
    );

    if (unavailableSpots.length > 0) {
      throw new BadRequestException(
        `Spots ${unavailableSpots.map((s) => s.name).join(', ')} are not available for reservation`,
      );
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind: dto.ticket_kind,
              email: dto.email,
              status: TicketStatus.reserved,
            })),
          });

          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: SpotStatus.reserved,
            },
          });

          const tickets = await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: dto.ticket_kind,
                  email: dto.email,
                },
              }),
            ),
          );

          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      return tickets;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002': // unique constraint violation
          case 'P2034': // transaction conflict
            throw new BadRequestException(e.message);
        }
      }
      throw e;
    }
  }
}
