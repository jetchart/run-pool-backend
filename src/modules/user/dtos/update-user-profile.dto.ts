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

export class UpdateUserProfileCarDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  brand?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  model?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  seats?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  licensePlate?: string;
}

export class UpdateUserProfileRaceTypeDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @IsEnum(RaceType)
  raceType: RaceType;
}

export class UpdateUserProfileDistanceDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @IsInt()
  distance: number;
}

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  surname?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(RunningExperience)
  runningExperience?: RunningExperience;

  @IsOptional()
  @IsEnum(UsuallyTravelRace)
  usuallyTravelRace?: UsuallyTravelRace;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  phoneCountryCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  imageName?: string;

  @IsOptional()
  imageFile?: Buffer;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserProfileCarDto)
  cars?: UpdateUserProfileCarDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserProfileRaceTypeDto)
  preferredRaceTypes?: UpdateUserProfileRaceTypeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserProfileDistanceDto)
  preferredDistances?: UpdateUserProfileDistanceDto[];
}