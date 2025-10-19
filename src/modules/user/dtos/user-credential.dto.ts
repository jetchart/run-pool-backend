import { UserDto } from './user.dto';
import { UserProfileResponse } from './user-profile-response.dto';

export class UserCredentialDto extends UserDto {
  accessToken: string;
  userProfile?: UserProfileResponse;

  constructor(user: UserDto, accessToken: string, userProfile?: UserProfileResponse) {
    super(
      user.userId,
      user.email,
      user.name,
      user.givenName,
      user.familyName,
      user.pictureUrl,
      user.administrator
    );
    this.accessToken = accessToken;
    this.userProfile = userProfile;
  }
}
