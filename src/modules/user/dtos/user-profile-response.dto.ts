import { Gender } from '../enums/gender.enum';
import { RunningExperience } from '../enums/running-experience.enum';
import { UsuallyTravelRace } from '../enums/usually-travel-race.enum';
import { RaceType } from '../../race/enums/race-type.enum';

export class UserProfileCarResponse {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  seats: number;
  licensePlate: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfileRaceTypeResponse {
  id: number;
  raceType: RaceType;
}

export class UserProfileDistanceResponse {
  id: number;
  distance: number;
}

export class UserResponse {
  id: number;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  pictureUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfileResponse {
  id: number;
  name: string;
  surname: string;
  email: string;
  birthYear: number;
  gender: Gender;
  runningExperience: RunningExperience;
  usuallyTravelRace: UsuallyTravelRace;
  phoneCountryCode: string;
  phoneNumber: string;
  imageName?: string;
  user: UserResponse;
  cars: UserProfileCarResponse[];
  preferredRaceTypes: UserProfileRaceTypeResponse[];
  preferredDistances: UserProfileDistanceResponse[];
  createdAt: Date;
  updatedAt: Date;
}