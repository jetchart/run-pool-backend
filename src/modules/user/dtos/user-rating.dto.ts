import { UserCredentialDto } from "./user-credential.dto";
export class UserRatingDto {
  user: UserCredentialDto;
  ratingsCount: number;
  average: number;

  constructor(user: UserCredentialDto, ratingsCount: number, average: number) {
    this.user = user;
    this.ratingsCount = ratingsCount;
    this.average = average;
  }
}
