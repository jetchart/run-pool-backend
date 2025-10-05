import { Controller, Post, Body } from '@nestjs/common';
import { UserCredentialDto } from '../../user/dtos/user-credential.dto';
import { AppLogger } from '../../app-logger/services/app-logger';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {}

  @Post('/google/login')
  async login(@Body('token') token: string): Promise<UserCredentialDto> {
    const logLocation = `${this.constructor.name}::login`;
    this.logger.logInfo(logLocation, 'Trying to log in with Google token');
    const response = await this.authService.login(token);
    this.logger.logInfo(logLocation, 'Login successful', {
      email: response.email,
    });
    return response;
  }
}
