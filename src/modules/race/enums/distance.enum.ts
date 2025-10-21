export enum Distance {
  FIVE_K = 5,
  TEN_K = 10,
  TWENTY_ONE_K = 21,
  FORTY_TWO_K = 42,
  ONE_HUNDRED_K = 100,
}

export interface DistanceInfo {
  id: number;
  description: string;
  shortDescription: string;
  kilometers: number;
}

export const DISTANCE_INFO: Record<Distance, DistanceInfo> = {
  [Distance.FIVE_K]: {
    id: 5,
    description: '5 kilómetros',
    shortDescription: '5K',
    kilometers: 5,
  },
  [Distance.TEN_K]: {
    id: 10,
    description: '10 kilómetros',
    shortDescription: '10K',
    kilometers: 10,
  },
  [Distance.TWENTY_ONE_K]: {
    id: 21,
    description: '21 kilómetros',
    shortDescription: '21K',
    kilometers: 21,
  },
  [Distance.FORTY_TWO_K]: {
    id: 42,
    description: '42 kilómetros',
    shortDescription: '42K',
    kilometers: 42,
  },
  [Distance.ONE_HUNDRED_K]: {
    id: 100,
    description: '100 kilómetros', 
    shortDescription: '100K',
    kilometers: 100,
  },
};