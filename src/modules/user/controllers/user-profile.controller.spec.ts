import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from '../services/user-profile.service';
import { CreateCompleteUserProfileDto } from '../dtos/create-complete-user-profile.dto';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { Gender } from '../enums/gender.enum';
import { RunningExperience } from '../enums/running-experience.enum';
import { UsuallyTravelRace } from '../enums/usually-travel-race.enum';
import { RaceType } from '../../race/enums/race-type.enum';
import { Distance } from '../enums/distance.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserProfileController', () => {
  let controller: UserProfileController;
  let service: UserProfileService;

  const mockUserProfileService = {
    createCompleteProfile: jest.fn(),
    findCompleteProfile: jest.fn(),
    findProfileByUserId: jest.fn(),
    deleteProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileController],
      providers: [
        {
          provide: UserProfileService,
          useValue: mockUserProfileService,
        },
      ],
    }).compile();

    controller = module.get<UserProfileController>(UserProfileController);
    service = module.get<UserProfileService>(UserProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCompleteProfile', () => {
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
      cars: [
        {
          id: 1,
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
          id: 1,
          raceType: RaceType.STREET,
        },
      ],
      preferredDistances: [
        {
          id: 1,
          distance: {
            id: 1,
            name: '10K',
            kilometers: 10,
          },
        },
      ],
    } as unknown as UserProfileEntity;

    it('should create a complete profile successfully', async () => {
      mockUserProfileService.createCompleteProfile.mockResolvedValue(mockProfile);

      const result = await controller.createCompleteProfile(mockDto);

      expect(result).toEqual(mockProfile);
      expect(service.createCompleteProfile).toHaveBeenCalledWith(mockDto);
      expect(service.createCompleteProfile).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserProfileService.createCompleteProfile.mockRejectedValue(
        new NotFoundException('User with id 1 not found'),
      );

      await expect(controller.createCompleteProfile(mockDto)).rejects.toThrow(
        new NotFoundException('User with id 1 not found'),
      );

      expect(service.createCompleteProfile).toHaveBeenCalledWith(mockDto);
    });

    it('should throw BadRequestException when user already has a profile', async () => {
      mockUserProfileService.createCompleteProfile.mockRejectedValue(
        new BadRequestException('User with id 1 already has a profile'),
      );

      await expect(controller.createCompleteProfile(mockDto)).rejects.toThrow(
        new BadRequestException('User with id 1 already has a profile'),
      );

      expect(service.createCompleteProfile).toHaveBeenCalledWith(mockDto);
    });

    it('should throw BadRequestException when license plate already exists', async () => {
      mockUserProfileService.createCompleteProfile.mockRejectedValue(
        new BadRequestException('License plates already exist: ABC123'),
      );

      await expect(controller.createCompleteProfile(mockDto)).rejects.toThrow(
        new BadRequestException('License plates already exist: ABC123'),
      );

      expect(service.createCompleteProfile).toHaveBeenCalledWith(mockDto);
    });
  });

  describe('findCompleteProfile', () => {
    const mockProfile = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      user: { id: 1 },
      cars: [],
      preferredRaceTypes: [],
      preferredDistances: [],
    } as unknown as UserProfileEntity;

    it('should return a complete profile', async () => {
      mockUserProfileService.findCompleteProfile.mockResolvedValue(mockProfile);

      const result = await controller.findCompleteProfile(1);

      expect(result).toEqual(mockProfile);
      expect(service.findCompleteProfile).toHaveBeenCalledWith(1);
      expect(service.findCompleteProfile).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockUserProfileService.findCompleteProfile.mockRejectedValue(
        new NotFoundException('User profile with id 1 not found'),
      );

      await expect(controller.findCompleteProfile(1)).rejects.toThrow(
        new NotFoundException('User profile with id 1 not found'),
      );

      expect(service.findCompleteProfile).toHaveBeenCalledWith(1);
    });
  });

  describe('findProfileByUserId', () => {
    const mockProfile = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      user: { id: 1 },
      cars: [],
      preferredRaceTypes: [],
      preferredDistances: [],
    } as unknown as UserProfileEntity;

    it('should return a profile by user id', async () => {
      mockUserProfileService.findProfileByUserId.mockResolvedValue(mockProfile);

      const result = await controller.findProfileByUserId(1);

      expect(result).toEqual(mockProfile);
      expect(service.findProfileByUserId).toHaveBeenCalledWith(1);
      expect(service.findProfileByUserId).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockUserProfileService.findProfileByUserId.mockRejectedValue(
        new NotFoundException('User profile for user id 1 not found'),
      );

      await expect(controller.findProfileByUserId(1)).rejects.toThrow(
        new NotFoundException('User profile for user id 1 not found'),
      );

      expect(service.findProfileByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile successfully', async () => {
      mockUserProfileService.deleteProfile.mockResolvedValue(undefined);

      const result = await controller.deleteProfile(1);

      expect(result).toBeUndefined();
      expect(service.deleteProfile).toHaveBeenCalledWith(1);
      expect(service.deleteProfile).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockUserProfileService.deleteProfile.mockRejectedValue(
        new NotFoundException('User profile with id 1 not found'),
      );

      await expect(controller.deleteProfile(1)).rejects.toThrow(
        new NotFoundException('User profile with id 1 not found'),
      );

      expect(service.deleteProfile).toHaveBeenCalledWith(1);
    });
  });
});