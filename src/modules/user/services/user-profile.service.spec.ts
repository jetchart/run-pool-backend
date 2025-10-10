import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { CarEntity } from '../entities/car.entity';
import { UserProfileRaceTypeEntity } from '../entities/user-profile-race-type.entity';
import { UserProfileDistanceEntity } from '../entities/user-profile-distance.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateCompleteUserProfileDto } from '../dtos/create-complete-user-profile.dto';
import { Gender } from '../enums/gender.enum';
import { RunningExperience } from '../enums/running-experience.enum';
import { UsuallyTravelRace } from '../enums/usually-travel-race.enum';
import { RaceType } from '../../race/enums/race-type.enum';
import { Distance } from '../enums/distance.enum';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let userProfileRepository: Repository<UserProfileEntity>;
  let carRepository: Repository<CarEntity>;
  let userProfileRaceTypeRepository: Repository<UserProfileRaceTypeEntity>;
  let userProfileDistanceRepository: Repository<UserProfileDistanceEntity>;
  let userRepository: Repository<UserEntity>;
  let dataSource: DataSource;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        {
          provide: getRepositoryToken(UserProfileEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(CarEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(UserProfileRaceTypeEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(UserProfileDistanceEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<UserProfileService>(UserProfileService);
    userProfileRepository = module.get<Repository<UserProfileEntity>>(
      getRepositoryToken(UserProfileEntity),
    );
    carRepository = module.get<Repository<CarEntity>>(getRepositoryToken(CarEntity));
    userProfileRaceTypeRepository = module.get<Repository<UserProfileRaceTypeEntity>>(
      getRepositoryToken(UserProfileRaceTypeEntity),
    );
    userProfileDistanceRepository = module.get<Repository<UserProfileDistanceEntity>>(
      getRepositoryToken(UserProfileDistanceEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCompleteProfile', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity;

    const mockDto: CreateCompleteUserProfileDto = {
      userId: 1,
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      birthYear: 1990,
      gender: Gender.MASCULINE,
      runningExperience: RunningExperience.INTERMEDIATE,
      usuallyTravelRace: UsuallyTravelRace.GO_ALONE,
      imageName: 'profile.jpg',
      cars: [
        {
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          licensePlate: 'ABC123',
          seats: 5,
          color: 'Red',
        },
      ],
      preferredRaceTypes: [
        {
          raceType: RaceType.STREET,
        },
      ],
      preferredDistances: [
        {
          distance: Distance.TEN_K,
        },
      ],
    };

    const mockManager = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    it('should create a complete profile successfully', async () => {
      const mockProfile = {
        id: 1,
        user: mockUser,
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        birthYear: 1990,
        gender: Gender.MASCULINE,
        runningExperience: RunningExperience.INTERMEDIATE,
        usuallyTravelRace: UsuallyTravelRace.GO_ALONE,
        imageName: 'profile.jpg',
      } as UserProfileEntity;

      const mockCreatedProfile = {
        ...mockProfile,
        cars: [{ id: 1, brand: 'Toyota', model: 'Corolla' }],
        preferredRaceTypes: [{ id: 1, raceType: RaceType.STREET }],
        preferredDistances: [{ id: 1, distance: Distance.TEN_K }],
      } as UserProfileEntity;

      mockManager.findOne
        .mockResolvedValueOnce(mockUser) // User exists
        .mockResolvedValueOnce(null) // No existing profile
        .mockResolvedValueOnce(mockCreatedProfile); // Final profile with relations

      mockManager.find.mockResolvedValueOnce([]); // No existing cars with same license plate

      mockManager.create
        .mockReturnValueOnce(mockProfile) // Profile creation
        .mockReturnValueOnce([{ licensePlate: 'ABC123' }]) // Car creation
        .mockReturnValueOnce([{ raceType: RaceType.STREET }]) // Race type creation
        .mockReturnValueOnce([{ distance: Distance.TEN_K }]); // Distance creation

      mockManager.save
        .mockResolvedValueOnce(mockProfile) // Save profile
        .mockResolvedValueOnce([]) // Save cars
        .mockResolvedValueOnce([]) // Save race types
        .mockResolvedValueOnce([]); // Save distances

      mockDataSource.transaction.mockImplementation(async (cb) => cb(mockManager));

      const result = await service.createCompleteProfile(mockDto);

      expect(result).toEqual(mockCreatedProfile);
      expect(mockManager.findOne).toHaveBeenCalledTimes(3);
      expect(mockManager.save).toHaveBeenCalledTimes(4);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockManager.findOne.mockResolvedValueOnce(null);
      mockDataSource.transaction.mockImplementation(async (cb) => cb(mockManager));

      await expect(service.createCompleteProfile(mockDto)).rejects.toThrow(
        new NotFoundException('User with id 1 not found'),
      );
    });

    it('should throw BadRequestException when user already has a profile', async () => {
      const existingProfile = { id: 1 } as UserProfileEntity;
      mockManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(existingProfile);
      mockDataSource.transaction.mockImplementation(async (cb) => cb(mockManager));

      await expect(service.createCompleteProfile(mockDto)).rejects.toThrow(
        new BadRequestException('User with id 1 already has a profile'),
      );
    });

    it('should throw BadRequestException when license plate already exists', async () => {
      const existingCar = { licensePlate: 'ABC123' } as CarEntity;
      mockManager.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      mockManager.find.mockResolvedValueOnce([existingCar]);
      mockDataSource.transaction.mockImplementation(async (cb) => cb(mockManager));

      await expect(service.createCompleteProfile(mockDto)).rejects.toThrow(
        new BadRequestException('License plates already exist: ABC123'),
      );
    });
  });

  describe('findCompleteProfile', () => {
    it('should return a complete profile', async () => {
      const mockProfile = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        birthYear: 1990,
        gender: Gender.MASCULINE,
        runningExperience: RunningExperience.INTERMEDIATE,
        usuallyTravelRace: UsuallyTravelRace.GO_ALONE,
        imageName: 'profile.jpg',
        user: { id: 1 },
        cars: [],
        preferredRaceTypes: [],
        preferredDistances: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as unknown as UserProfileEntity;

      mockRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.findCompleteProfile(1);

      expect(result).toEqual(mockProfile);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'user',
          'cars',
          'preferredRaceTypes',
          'preferredDistances',
        ],
      });
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findCompleteProfile(1)).rejects.toThrow(
        new NotFoundException('User profile with id 1 not found'),
      );
    });
  });

  describe('findProfileByUserId', () => {
    it('should return a profile by user id', async () => {
      const mockProfile = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        user: { id: 1 },
      } as unknown as UserProfileEntity;

      mockRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.findProfileByUserId(1);

      expect(result).toEqual(mockProfile);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: [
          'user',
          'cars',
          'preferredRaceTypes',
          'preferredDistances',
        ],
      });
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findProfileByUserId(1)).rejects.toThrow(
        new NotFoundException('User profile for user id 1 not found'),
      );
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile successfully', async () => {
      const mockProfile = { id: 1 } as UserProfileEntity;
      mockRepository.findOne.mockResolvedValue(mockProfile);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.deleteProfile(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteProfile(1)).rejects.toThrow(
        new NotFoundException('User profile with id 1 not found'),
      );
    });
  });
});