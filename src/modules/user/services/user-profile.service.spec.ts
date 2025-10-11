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
import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { UserProfileResponse } from '../dtos/user-profile-response.dto';
import { Gender } from '../enums/gender.enum';
import { RunningExperience } from '../enums/running-experience.enum';
import { UsuallyTravelRace } from '../enums/usually-travel-race.enum';
import { RaceType } from '../../race/enums/race-type.enum';
import { Distance } from '../../race/enums/distance.enum';

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
        user: {
          ...mockUser,
          name: 'Test User',
          givenName: 'Test',
          familyName: 'User',
          pictureUrl: 'http://example.com/pic.jpg',
        },
        cars: [{ id: 1, brand: 'Toyota', model: 'Corolla', createdAt: new Date(), updatedAt: new Date() }],
        preferredRaceTypes: [{ id: 1, raceType: RaceType.STREET }],
        preferredDistances: [{ id: 1, distance: Distance.TEN_K }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as UserProfileEntity;

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

      expect(result).toEqual({
        id: mockCreatedProfile.id,
        name: mockCreatedProfile.name,
        surname: mockCreatedProfile.surname,
        email: mockCreatedProfile.email,
        birthYear: mockCreatedProfile.birthYear,
        gender: mockCreatedProfile.gender,
        runningExperience: mockCreatedProfile.runningExperience,
        usuallyTravelRace: mockCreatedProfile.usuallyTravelRace,
        imageName: mockCreatedProfile.imageName,
        user: {
          id: mockCreatedProfile.user.id,
          name: mockCreatedProfile.user.name,
          givenName: mockCreatedProfile.user.givenName,
          familyName: mockCreatedProfile.user.familyName,
          email: mockCreatedProfile.user.email,
          pictureUrl: mockCreatedProfile.user.pictureUrl,
          createdAt: mockCreatedProfile.user.createdAt,
          updatedAt: mockCreatedProfile.user.updatedAt,
        },
        cars: mockCreatedProfile.cars,
        preferredRaceTypes: mockCreatedProfile.preferredRaceTypes,
        preferredDistances: mockCreatedProfile.preferredDistances,
        createdAt: mockCreatedProfile.createdAt,
        updatedAt: mockCreatedProfile.updatedAt,
      });
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
        user: { 
          id: 1,
          name: 'Test User',
          givenName: 'Test',
          familyName: 'User',
          email: 'test@example.com',
          pictureUrl: 'http://example.com/pic.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        cars: [],
        preferredRaceTypes: [],
        preferredDistances: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as unknown as UserProfileEntity;

      mockRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.findCompleteProfile(1);

      expect(result).toEqual({
        id: mockProfile.id,
        name: mockProfile.name,
        surname: mockProfile.surname,
        email: mockProfile.email,
        birthYear: mockProfile.birthYear,
        gender: mockProfile.gender,
        runningExperience: mockProfile.runningExperience,
        usuallyTravelRace: mockProfile.usuallyTravelRace,
        imageName: mockProfile.imageName,
        user: mockProfile.user,
        cars: mockProfile.cars,
        preferredRaceTypes: mockProfile.preferredRaceTypes,
        preferredDistances: mockProfile.preferredDistances,
        createdAt: mockProfile.createdAt,
        updatedAt: mockProfile.updatedAt,
      });
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
        email: 'john.doe@example.com',
        birthYear: 1990,
        gender: Gender.MASCULINE,
        runningExperience: RunningExperience.INTERMEDIATE,
        usuallyTravelRace: UsuallyTravelRace.GO_ALONE,
        imageName: 'profile.jpg',
        user: { 
          id: 1,
          name: 'Test User',
          givenName: 'Test',
          familyName: 'User',
          email: 'test@example.com',
          pictureUrl: 'http://example.com/pic.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        cars: [],
        preferredRaceTypes: [],
        preferredDistances: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as UserProfileEntity;

      mockRepository.findOne.mockResolvedValue(mockProfile);

      const result = await service.findProfileByUserId(1);

      expect(result).toEqual({
        id: mockProfile.id,
        name: mockProfile.name,
        surname: mockProfile.surname,
        email: mockProfile.email,
        birthYear: mockProfile.birthYear,
        gender: mockProfile.gender,
        runningExperience: mockProfile.runningExperience,
        usuallyTravelRace: mockProfile.usuallyTravelRace,
        imageName: mockProfile.imageName,
        user: mockProfile.user,
        cars: mockProfile.cars,
        preferredRaceTypes: mockProfile.preferredRaceTypes,
        preferredDistances: mockProfile.preferredDistances,
        createdAt: mockProfile.createdAt,
        updatedAt: mockProfile.updatedAt,
      });
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

  describe('updateProfileByUserId', () => {
    it('should update profile by user id successfully', async () => {
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
        user: { 
          id: 1,
          name: 'Test User',
          givenName: 'Test',
          familyName: 'User',
          email: 'test@example.com',
          pictureUrl: 'http://example.com/pic.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        cars: [],
        preferredRaceTypes: [{ id: 1, raceType: RaceType.STREET }],
        preferredDistances: [{ id: 1, distance: Distance.TEN_K }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as UserProfileEntity;

      const updateDto = {
        name: 'Updated Name',
        preferredRaceTypes: [
          { raceType: RaceType.TRAIL }, // Nuevo tipo
        ],
        preferredDistances: [
          { distance: Distance.TEN_K }, // Mantener existente
          { distance: Distance.FIVE_K }, // Nuevo
        ],
      };

      const mockManager = {
        findOne: jest.fn()
          .mockResolvedValueOnce(mockProfile) // Buscar perfil por userId
          .mockResolvedValueOnce(mockProfile) // Buscar perfil por id en updateProfileInternal
          .mockResolvedValueOnce({
            ...mockProfile,
            name: 'Updated Name',
            preferredRaceTypes: [{ id: 2, raceType: RaceType.TRAIL }],
            preferredDistances: [
              { id: 1, distance: Distance.TEN_K },
              { id: 3, distance: Distance.FIVE_K }
            ],
          }), // Retornar perfil actualizado
        find: jest.fn()
          .mockResolvedValueOnce([{ id: 1, raceType: RaceType.STREET }]) // Existing race types
          .mockResolvedValueOnce([{ id: 1, distance: Distance.TEN_K }]), // Existing distances
        save: jest.fn(),
        delete: jest.fn(),
        create: jest.fn()
          .mockReturnValue({ raceType: RaceType.TRAIL })
          .mockReturnValue({ distance: Distance.FIVE_K }),
      };

      mockDataSource.transaction.mockImplementation(async (cb) => cb(mockManager));

      const result = await service.updateProfileByUserId(1, updateDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Name');
      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      
      // Verificar que se buscó el perfil por userId
      expect(mockManager.findOne).toHaveBeenCalledWith(UserProfileEntity, {
        where: { user: { id: 1 } },
        relations: ['cars', 'preferredRaceTypes', 'preferredDistances'],
      });

      // Verificar que se eliminaron race types que ya no están
      expect(mockManager.delete).toHaveBeenCalledWith(UserProfileRaceTypeEntity, [1]);
      
      // Verificar que se guardaron las entidades actualizadas
      expect(mockManager.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user profile not found', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValueOnce(null),
      };

      mockDataSource.transaction.mockImplementation(async (cb) => cb(mockManager));

      await expect(service.updateProfileByUserId(999, { name: 'Test' })).rejects.toThrow(
        new NotFoundException('User profile for user id 999 not found'),
      );
    });
  });
});