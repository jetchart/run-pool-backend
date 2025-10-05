import { RaceEntity } from '../entities/race.entity';
import { mockRace } from './mock-race';
import { mockRaceDistance } from './mock-race-distance';

export const mockRaceWithDistances: RaceEntity = {
  ...mockRace,
  distances: [mockRaceDistance],
};