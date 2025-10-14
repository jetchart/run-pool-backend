import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../entities/user.entity';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { CarEntity } from '../entities/car.entity';
import { UserCredentialDto } from '../dtos/user-credential.dto';
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

const mockCar: CarEntity = {
  id: 1,
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  color: 'Blue',
  seats: 5,
  licensePlate: 'ABC123',
  userProfile: {} as UserProfileEntity,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserProfile: UserProfileEntity = {
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
  user: mockUser as UserEntity,
  cars: [mockCar],
  preferredRaceTypes: [],
  preferredDistances: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserWithProfile = {
  ...mockUser,
  userProfile: mockUserProfile,
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

  describe('findUserWithProfile', () => {
    it('should return UserCredentialDto with userProfile when user exists with profile', async () => {
      repo.findOne.mockResolvedValue(mockUserWithProfile as UserEntity);

      const result = await service.findUserWithProfile(1);

      expect(result).toBeInstanceOf(UserCredentialDto);
      expect(result.userId).toBe(1);
      expect(result.email).toBe('john@example.com');
      expect(result.name).toBe('John');
      expect(result.userProfile).toBeDefined();
      expect(result.userProfile?.id).toBe(1);
      expect(result.userProfile?.name).toBe('John');
      expect(result.userProfile?.surname).toBe('Doe');
      expect(result.userProfile?.cars).toHaveLength(1);
      expect(result.userProfile?.cars[0].brand).toBe('Toyota');
      expect(result.userProfile?.cars[0].model).toBe('Corolla');
      expect(result.userProfile?.cars[0].licensePlate).toBe('ABC123');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['userProfile', 'userProfile.cars', 'userProfile.preferredRaceTypes', 'userProfile.preferredDistances']
      });
    });

    it('should return UserCredentialDto without userProfile when user exists but has no profile', async () => {
      repo.findOne.mockResolvedValue(mockUser as UserEntity);

      const result = await service.findUserWithProfile(1);

      expect(result).toBeInstanceOf(UserCredentialDto);
      expect(result.userId).toBe(1);
      expect(result.email).toBe('john@example.com');
      expect(result.name).toBe('John');
      expect(result.userProfile).toBeUndefined();

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['userProfile', 'userProfile.cars', 'userProfile.preferredRaceTypes', 'userProfile.preferredDistances']
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findUserWithProfile(999)).rejects.toThrow(NotFoundException);
      await expect(service.findUserWithProfile(999)).rejects.toThrow('User not found');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['userProfile', 'userProfile.cars', 'userProfile.preferredRaceTypes', 'userProfile.preferredDistances']
      });
    });

    it('should handle user with profile but no cars', async () => {
      const userWithProfileNoCars = {
        ...mockUser,
        userProfile: {
          ...mockUserProfile,
          cars: [],
        },
      };
      repo.findOne.mockResolvedValue(userWithProfileNoCars as UserEntity);

      const result = await service.findUserWithProfile(1);

      expect(result).toBeInstanceOf(UserCredentialDto);
      expect(result.userProfile).toBeDefined();
      expect(result.userProfile?.cars).toHaveLength(0);
      expect(result.userProfile?.preferredRaceTypes).toHaveLength(0);
      expect(result.userProfile?.preferredDistances).toHaveLength(0);
    });
  });
});
