import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateRaceDistanceDto {
  @IsInt()
  @Min(1)
  distance: number;
}
