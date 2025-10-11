import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { AppLogger } from '../../app-logger/services/app-logger';
import { UserCredentialDto } from '../../user/dtos/user-credential.dto';
import { UserDto } from '../../user/dtos/user.dto';

const mockUserCredential = new UserCredentialDto(
  new UserDto(
    1,
    'john@example.com',
    'John',
    'John',
    'Doe',
    'http://example.com/pic.jpg',
  ),
  'jwt-token',
);

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let logger: AppLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(mockUserCredential),
          },
        },
        {
          provide: AppLogger,
          useValue: {
            logInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    logger = module.get<AppLogger>(AppLogger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login with Google token and return UserCredentialDto', async () => {
    const token = 'test-google-token';
    const result = await controller.login(token);
    expect(authService.login).toHaveBeenCalledWith(token);
    expect(logger.logInfo).toHaveBeenCalledTimes(2);
    expect(result).toBe(mockUserCredential);
    expect(result).toBeInstanceOf(UserCredentialDto);
    expect(result.email).toBe('john@example.com');
    expect(result.accessToken).toBe('jwt-token');
  });
});
