import {
  IsArray,
  IsInt,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserProfileDistanceDto {
  @IsInt()
  @Min(1)
  distanceId: number;
}

export class UpdateUserProfileDistancesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserProfileDistanceDto)
  preferredDistances: UserProfileDistanceDto[];
}