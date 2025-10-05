import { RaceDistanceEntity } from '../entities/race-distance.entity';
import { mockRace } from './mock-race';
import { mockDistance } from './mock-distance';

export const mockRaceDistance: RaceDistanceEntity = {
  id: 1,
  race: mockRace,
  distance: mockDistance,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
};