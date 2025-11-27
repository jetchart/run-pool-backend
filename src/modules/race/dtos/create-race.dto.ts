import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUrl,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRaceDistanceDto } from './create-race-distance.dto';
import { RaceType } from '../enums/race-type.enum';

export class CreateRaceDto {
  image?: Buffer;

  imageThumbnail?: Buffer;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  province: string;  
  
  @IsString()
  @IsNotEmpty()
  country: string;  
  
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsUrl()
  @IsNotEmpty()
  website: string;

  @IsEnum(RaceType)
  raceType: RaceType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRaceDistanceDto)
  raceDistances: CreateRaceDistanceDto[];
}
