import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TripRatingType } from '../enums/trip-rating-type.enum';

export class CreateTripRatingDto {
  @IsInt()
  tripId: number;

  @IsInt()
  raterId: number;

  @IsInt()
  ratedId: number;

  @IsEnum(TripRatingType)
  type: TripRatingType;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
