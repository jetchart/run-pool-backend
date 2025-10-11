
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceEntity } from '../entities/race.entity';
import { RaceDistanceEntity } from '../entities/race-distance.entity';
import { CreateRaceDto } from '../dtos/create-race.dto';
import { validateOrReject } from 'class-validator';

@Injectable()
export class RaceService {
  constructor(
    @InjectRepository(RaceEntity)
    private readonly raceRepository: Repository<RaceEntity>,
    @InjectRepository(RaceDistanceEntity)
    private readonly raceDistanceRepository: Repository<RaceDistanceEntity>,
  ) {}

  async findAll(): Promise<RaceEntity[]> {
    return this.raceRepository.find({
      relations: ['distances'],
      order: { startDate: 'ASC' },
    });
  }

  async create(data: CreateRaceDto): Promise<RaceEntity> {
    await validateOrReject(data);
    const { raceDistances, ...raceData } = data;
    const race = this.raceRepository.create(raceData);
    const savedRace = await this.raceRepository.save(race);

    if (raceDistances && raceDistances.length > 0) {
      const raceDistanceEntities = raceDistances.map((rd) =>
        this.raceDistanceRepository.create({
          race: savedRace,
          distance: { id: rd.distanceId } as any, // Only id needed for relation
        })
      );
      await this.raceDistanceRepository.save(raceDistanceEntities);
    }

    // Return the race with its distances
    return this.raceRepository.findOne({
      where: { id: savedRace.id },
      relations: ['distances', 'distances.distance'],
    }) as Promise<RaceEntity>;
  }
}
