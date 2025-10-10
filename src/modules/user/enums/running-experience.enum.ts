export enum RunningExperience {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
}

export interface RunningExperienceInfo {
  id: number;
  description: string;
}

export const RUNNING_EXPERIENCE_INFO: Record<RunningExperience, RunningExperienceInfo> = {
  [RunningExperience.BEGINNER]: {
    id: 1,
    description: 'Principiante',
  },
  [RunningExperience.INTERMEDIATE]: {
    id: 2,
    description: 'Intermedio',
  },
  [RunningExperience.ADVANCED]: {
    id: 3,
    description: 'Avanzado',
  },
};