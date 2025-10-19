export class UserDto {
  userId: number;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  pictureUrl: string;
  administrator: boolean;

  constructor(
    userId: number,
    email: string,
    name: string,
    givenName: string,
    familyName: string,
    pictureUrl: string,
    administrator: boolean
  ) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.givenName = givenName;
    this.familyName = familyName;
    this.pictureUrl = pictureUrl;
    this.administrator = administrator;
  }
}
