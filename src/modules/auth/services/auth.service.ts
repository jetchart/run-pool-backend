import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/services/user.service';
import { UserCredentialDto } from '../../user/dtos/user-credential.dto';
import { UserDto } from '../../user/dtos/user.dto';

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const googleClientId = this.configService.get<string>('google.clientId');
    this.client = new OAuth2Client(googleClientId);
  }

  async login(token: string): Promise<UserCredentialDto> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new UnauthorizedException('Invalid Google token');

    const existingUser = await this.userService.findByEmail(payload.email!);

    const userDto = new UserDto(
      payload.email!,
      payload.name!,
      payload.given_name!,
      payload.family_name!,
      payload.picture!,
    );

    const persistedUser = existingUser
      ? existingUser
      : await this.userService.create(userDto);

    const access_token = this.jwtService.sign({ sub: persistedUser.email });
    return new UserCredentialDto(userDto, access_token);
  }
}
