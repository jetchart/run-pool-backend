import { RaceDistanceEntity } from '../entities/race-distance.entity';
import { mockRace } from './mock-race';


export const mockRaceDistance: RaceDistanceEntity = {
  id: 1,
  race: mockRace,
  distance: 10, // Distance.TEN_K
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
};