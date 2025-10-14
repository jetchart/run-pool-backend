import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserCredentialDto } from '../dtos/user-credential.dto';
import { UserDto } from '../dtos/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

const mockUsers = [
  {
    id: 1,
    name: 'John',
    givenName: 'John',
    familyName: 'Doe',
    pictureUrl: 'http://example.com/pic.jpg',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
  },
];

const mockUserCredential = new UserCredentialDto(
  new UserDto(1, 'john@example.com', 'John', 'John', 'Doe', 'http://example.com/pic.jpg'),
  '',
  {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    birthYear: 1990,
    gender: 1,
    runningExperience: 1,
    usuallyTravelRace: 1,
    phoneCountryCode: '+1',
    phoneNumber: '1234567890',
    imageName: 'profile.jpg',
    user: {
      id: 1,
      name: 'John',
      givenName: 'John',
      familyName: 'Doe',
      email: 'john@example.com',
      pictureUrl: 'http://example.com/pic.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    cars: [],
    preferredRaceTypes: [],
    preferredDistances: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
);

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockUsers),
            findUserWithProfile: jest.fn().mockResolvedValue(mockUserCredential),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users (GET /users)', async () => {
    const result = await controller.getAllUser();
    expect(result).toEqual(mockUsers);
    expect(userService.findAll).toHaveBeenCalled();
  });

  it('should return user with profile (GET /users/:id)', async () => {
    const result = await controller.getUserWithProfile(1);
    expect(result).toEqual(mockUserCredential);
    expect(userService.findUserWithProfile).toHaveBeenCalledWith(1);
  });
});
