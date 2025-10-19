import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number): Promise<RaceEntity> {
    const race = await this.raceRepository.findOne({
      where: { id },
      relations: ['distances'],
    });

    if (!race) {
      throw new NotFoundException(`Race with ID ${id} not found`);
    }

    return race;
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
          distance: rd.distanceId, // distance is stored as integer (enum)
        })
      );
      await this.raceDistanceRepository.save(raceDistanceEntities);
    }

    // Return the race with its distances
    return this.raceRepository.findOne({
      where: { id: savedRace.id },
      relations: ['distances'],
    }) as Promise<RaceEntity>;
  }

  async update(id: number, data: Partial<CreateRaceDto> & { raceDistances?: { distanceId: number }[] }): Promise<RaceEntity> {

    const existing = await this.raceRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Race with ID ${id} not found`);
    }

    // Separar raceDistances del resto
    const { raceDistances, ...raceData } = data as any;

    // Usar QueryRunner para operación atómica si se actualizarán distancias
    if (raceDistances && Array.isArray(raceDistances)) {
      const queryRunner = this.raceRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.update(RaceEntity, { id }, { ...raceData, updatedAt: new Date() });

        // Eliminar distancias existentes
        await queryRunner.manager.createQueryBuilder()
          .delete()
          .from(RaceDistanceEntity)
          .where('race_id = :raceId', { raceId: id })
          .execute();

        // Insertar nuevas distancias
        // Crear entidades RaceDistance y guardarlas con el queryRunner para mantener la transacción
        const rdEntities = raceDistances.map((rd: any) =>
          this.raceDistanceRepository.create({
            race: { id } as any,
            distance: rd.distanceId,
          }),
        );

        if (rdEntities.length > 0) {
          await queryRunner.manager.save(rdEntities);
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } else {
      // Solo actualizar la entidad race
      await this.raceRepository.update(id, { ...raceData, updatedAt: new Date() });
    }

    // Devolver la entidad con relaciones
    return this.raceRepository.findOne({ where: { id }, relations: ['distances'] }) as Promise<RaceEntity>;
  }
}
