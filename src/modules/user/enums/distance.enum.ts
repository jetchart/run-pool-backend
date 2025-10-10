export enum Distance {
  FIVE_K = 5,
  TEN_K = 20,
  TWENTY_ONE_K = 21,
  FORTY_TWO_K = 42,
}

export interface DistanceInfo {
  id: number;
  description: string;
  shortDescription: string;
}

export const DISTANCE_INFO: Record<Distance, DistanceInfo> = {
  [Distance.FIVE_K]: {
    id: 5,
    description: '5 kilómetros',
    shortDescription: '5K',
  },
  [Distance.TEN_K]: {
    id: 20,
    description: '10 kilómetros',
    shortDescription: '10K',
  },
  [Distance.TWENTY_ONE_K]: {
    id: 21,
    description: '21 kilómetros',
    shortDescription: '21K',
  },
  [Distance.FORTY_TWO_K]: {
    id: 42,
    description: '42 kilómetros',
    shortDescription: '42K',
  },
};