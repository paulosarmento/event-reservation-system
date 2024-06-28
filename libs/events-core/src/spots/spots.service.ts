import { Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotStatus } from '@prisma/client';
import { NotFoundError } from '../errors';
import { PrismaService } from 'libs/prisma/prisma.service';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    try {
      // Verifique se o evento existe antes de criar o spot
      await this.prismaService.event.findUniqueOrThrow({
        where: { id: createSpotDto.eventId },
      });

      // Verifique se o spot já existe
      const existingSpot = await this.prismaService.spot.findFirst({
        where: {
          eventId: createSpotDto.eventId,
          name: createSpotDto.name,
        },
      });

      if (!existingSpot) {
        return this.prismaService.spot.create({
          data: {
            ...createSpotDto,
            status: SpotStatus.available,
          },
        });
      }

      throw new NotFoundError(`Spot ${createSpotDto.name} already exists`);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(
          `Event with ID ${createSpotDto.eventId} not found`,
        );
      }
      throw error;
    }
  }

  async findAll(eventId: string) {
    const spots = await this.prismaService.spot.findMany({
      where: { eventId },
    });
    if (spots.length === 0) {
      throw new NotFoundError('No spots found for this event');
    }
    return spots;
  }

  async findOne(eventId: string, spotId: string) {
    try {
      return await this.prismaService.spot.findUniqueOrThrow({
        where: {
          eventId,
          id: spotId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(
          `Spot with ID ${spotId} not found for event ${eventId}`,
        );
      }
      throw error;
    }
  }

  async update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    try {
      // Verificar se existe um spot com o mesmo nome no mesmo evento
      const existingSpot = await this.prismaService.spot.findFirst({
        where: {
          name: updateSpotDto.name,
          eventId,
          id: {
            not: spotId, // Excluir o próprio spot da verificação
          },
        },
      });

      if (existingSpot) {
        throw new NotFoundError(
          'Spot with this name already exists for the event',
        );
      }

      // Atualizar o spot
      return await this.prismaService.spot.update({
        where: {
          eventId,
          id: spotId,
        },
        data: updateSpotDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(
          `Spot with ID ${spotId} not found for event ${eventId}`,
        );
      }
      throw error;
    }
  }

  async remove(eventId: string, spotId: string) {
    const spot = await this.prismaService.spot.findUnique({
      where: {
        eventId,
        id: spotId,
      },
    });

    if (!spot) {
      throw new NotFoundError(
        `Spot with ID ${spotId} not found for event ${eventId}`,
      );
    }
    if (spot.status === SpotStatus.reserved) {
      throw new NotFoundError(
        `Spot ${spotId} is reserved and cannot be deleted`,
      );
    }
    try {
      return await this.prismaService.spot.delete({
        where: {
          eventId,
          id: spotId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(
          `Spot with ID ${spotId} not found for event ${eventId}`,
        );
      }
      throw error;
    }
  }
}
