export class UserDto {
  userId: number;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  pictureUrl: string;

  constructor(
    userId: number,
    email: string,
    name: string,
    givenName: string,
    familyName: string,
    pictureUrl: string,
  ) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.givenName = givenName;
    this.familyName = familyName;
    this.pictureUrl = pictureUrl;
  }
}
