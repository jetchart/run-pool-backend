import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
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
});
