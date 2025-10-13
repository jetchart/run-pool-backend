import { 
  IsNotEmpty, 
  IsString, 
  Length, 
  IsDateString, 
  IsInt, 
  Min, 
  Max, 
  IsOptional,
  Matches 
} from 'class-validator';

export class CreateTripDto {
  @IsInt()
  @IsNotEmpty()
  driverId: number;

  @IsInt()
  @IsNotEmpty()
  raceId: number;

  @IsDateString()
  @IsNotEmpty()
  departureDay: string; // Format: YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'departureHour must be in HH:MM format (24-hour)'
  })
  departureHour: string; // Format: HH:MM

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  departureCity: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  departureProvince: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsInt()
  @Min(1)
  @Max(8)
  seats: number;
}