import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

const mockUser = {
  id: 1,
  name: 'John',
  givenName: 'John',
  familyName: 'Doe',
  pictureUrl: 'http://example.com/pic.jpg',
  email: 'john@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
};

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return users', async () => {
    repo.find.mockResolvedValue([mockUser as UserEntity]);
    const users = await service.findAll();
    expect(users).toEqual([mockUser]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('findOne should return a user by id', async () => {
    repo.findOne.mockResolvedValue(mockUser as UserEntity);
    const user = await service.findOne(1);
    expect(user).toEqual(mockUser);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('findByEmail should return a user by email', async () => {
    repo.findOne.mockResolvedValue(mockUser as UserEntity);
    const user = await service.findByEmail('john@example.com');
    expect(user).toEqual(mockUser);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
  });

  it('create should create and save a user', async () => {
    repo.create.mockReturnValue(mockUser as UserEntity);
    repo.save.mockResolvedValue(mockUser as UserEntity);
    const user = await service.create({ name: 'John' });
    expect(user).toEqual(mockUser);
    expect(repo.create).toHaveBeenCalledWith({ name: 'John' });
    expect(repo.save).toHaveBeenCalledWith(mockUser);
  });

  it('update should update and return the user', async () => {
    repo.update.mockResolvedValue(undefined as any);
    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as UserEntity);
    const user = await service.update(1, { name: 'Jane' });
    expect(user).toEqual(mockUser);
    expect(repo.update).toHaveBeenCalledWith(1, { name: 'Jane' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('remove should delete the user', async () => {
    repo.delete.mockResolvedValue(undefined as any);
    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
