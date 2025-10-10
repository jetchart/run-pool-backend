export enum Gender {
  MASCULINE = 1,
  FEMININE = 2,
  NON_BINARY = 3,
  PREFER_NOT_TO_SAY = 4,
  OTHER = 5,
}

export interface GenderInfo {
  id: number;
  description: string;
}

export const GENDER_INFO: Record<Gender, GenderInfo> = {
  [Gender.MASCULINE]: {
    id: 1,
    description: 'Masculino',
  },
  [Gender.FEMININE]: {
    id: 2,
    description: 'Femenino',
  },
  [Gender.NON_BINARY]: {
    id: 3,
    description: 'No Binario',
  },
  [Gender.PREFER_NOT_TO_SAY]: {
    id: 4,
    description: 'Prefiero no decir',
  },
  [Gender.OTHER]: {
    id: 5,
    description: 'Otro',
  },
};