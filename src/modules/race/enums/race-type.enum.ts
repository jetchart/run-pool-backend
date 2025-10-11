export enum RaceType {
  STREET = 1,
  TRAIL = 2,
}

export interface RaceTypeInfo {
  id: number;
  description: string;
}

export const RACE_TYPE_INFO: Record<RaceType, RaceTypeInfo> = {
  [RaceType.STREET]: {
    id: 1,
    description: 'Calle',
  },
  [RaceType.TRAIL]: {
    id: 2,
    description: 'Trail',
  },
};
