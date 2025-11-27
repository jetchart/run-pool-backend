import { RaceEntity } from '../entities/race.entity';
import { RaceType } from '../enums/race-type.enum';

export const mockRaceEntity = (overrides?: Partial<RaceEntity>): RaceEntity => {
  const race = new RaceEntity();
  race.id = 1;
  race.name = 'Carrera 10K La Plata';
  race.description = 'Carrera de 10K en La Plata';
  race.startDate = '2026-12-25';
  race.endDate = '2026-12-25';
  race.city = 'La Plata';
  race.province = 'Buenos Aires';
  race.country = 'Argentina';
  race.location = 'Parque San Martín, La Plata';
  race.website = 'https://example.com/race';
  race.raceType = RaceType.STREET;
  race.distances = [];
  race.createdAt = new Date('2025-10-13T10:00:00Z');
  race.updatedAt = new Date('2025-10-13T10:00:00Z');

  return Object.assign(race, overrides);
};