export class UserDto {
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  pictureUrl: string;

  constructor(
    email: string,
    name: string,
    givenName: string,
    familyName: string,
    pictureUrl: string,
  ) {
    this.email = email;
    this.name = name;
    this.givenName = givenName;
    this.familyName = familyName;
    this.pictureUrl = pictureUrl;
  }
}
