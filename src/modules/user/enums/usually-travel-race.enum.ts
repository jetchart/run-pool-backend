export enum UsuallyTravelRace {
  GO_ALONE = 1,
  GO_WITH_FRIENDS_FAMILY = 2,
  USUALLY_BRING_PEOPLE = 3,
}

export interface UsuallyTravelRaceInfo {
  id: number;
  description: string;
}

export const USUALLY_TRAVEL_RACE_INFO: Record<UsuallyTravelRace, UsuallyTravelRaceInfo> = {
  [UsuallyTravelRace.GO_ALONE]: {
    id: 1,
    description: 'Voy solo',
  },
  [UsuallyTravelRace.GO_WITH_FRIENDS_FAMILY]: {
    id: 2,
    description: 'Voy con amigos/familia',
  },
  [UsuallyTravelRace.USUALLY_BRING_PEOPLE]: {
    id: 3,
    description: 'Suelo llevar gente',
  },
};