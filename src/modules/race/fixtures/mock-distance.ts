import { DistanceEntity } from '../entities/distance.entity';

export const mockDistance: DistanceEntity = {
  id: 1,
  description: '10 kilometers distance',
  shortDescription: '10K',
  kilometers: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
  races: [],
};