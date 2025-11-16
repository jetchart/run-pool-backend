import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '../enums/gender.enum';
import { RunningExperience } from '../enums/running-experience.enum';
import { UsuallyTravelRace } from '../enums/usually-travel-race.enum';
import { RaceType } from '../../race/enums/race-type.enum';

export class CreateUserProfileCarDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  brand: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  model: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  color: string;

  @IsInt()
  @Min(1)
  @Max(50)
  seats: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  licensePlate: string;
}

export class CreateUserProfileRaceTypeDto {
  @IsEnum(RaceType)
  raceType: RaceType;
}

export class CreateUserProfileDistanceDto {
  @IsInt()
  distance: number;
}

export class CreateCompleteUserProfileDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  surname: string;

  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(RunningExperience)
  runningExperience: RunningExperience;

  @IsEnum(UsuallyTravelRace)
  usuallyTravelRace: UsuallyTravelRace;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  phoneCountryCode: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  imageName?: string;

  @IsOptional()
  imageFile?: Buffer;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserProfileCarDto)
  @IsOptional()
  cars?: CreateUserProfileCarDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserProfileRaceTypeDto)
  @IsOptional()
  preferredRaceTypes?: CreateUserProfileRaceTypeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserProfileDistanceDto)
  @IsOptional()
  preferredDistances?: CreateUserProfileDistanceDto[];
}