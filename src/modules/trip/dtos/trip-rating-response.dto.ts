import { TripRatingType } from '../enums/trip-rating-type.enum';

export class TripRatingResponseDto {
  id: number;
  tripId: number;
  raterId: number;
  ratedId: number;
  type: TripRatingType;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
