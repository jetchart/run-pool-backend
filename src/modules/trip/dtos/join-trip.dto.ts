import { IsInt, IsNotEmpty } from 'class-validator';

export class JoinTripDto {
  @IsInt()
  @IsNotEmpty()
  tripId: number;

  @IsInt()
  @IsNotEmpty()
  passengerId: number;
}