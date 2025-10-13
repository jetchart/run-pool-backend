import { 
  IsOptional, 
  IsString, 
  Length, 
  IsDateString, 
  IsInt, 
  Min, 
  Max,
  Matches 
} from 'class-validator';

export class UpdateTripDto {
  @IsOptional()
  @IsDateString()
  departureDay?: string; // Format: YYYY-MM-DD

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'departureHour must be in HH:MM format (24-hour)'
  })
  departureHour?: string; // Format: HH:MM

  @IsOptional()
  @IsString()
  @Length(1, 100)
  departureCity?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  departureProvince?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  arrivalCity?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  arrivalProvince?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;


}