import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, QueryRunner, Connection, IsNull } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripEntity } from '../entities/trip.entity';
import { TripPassengerEntity } from '../entities/trip-passenger.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { RaceEntity } from '../../race/entities/race.entity';
import { CarEntity } from '../../user/entities/car.entity';
import { UserProfileEntity } from '../../user/entities/user-profile.entity';
import { mockCreateTripDto } from '../fixtures/mock-create-trip-dto';
import { mockTripEntity } from '../fixtures/mock-trip-entity';
import { mockUserEntity } from '../../user/fixtures/mock-user-entity';
import { mockRaceEntity } from '../../race/fixtures/mock-race-entity';
import { mockTripPassengerEntity } from '../fixtures/mock-trip-passenger';

// Mock CarEntity
const mockCarEntity = (): CarEntity => ({
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
});

// Mock UserProfileEntity with car
const mockUserProfileEntity = (): UserProfileEntity => ({
  id: 1,
  user: mockUserEntity(),
  name: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  birthYear: 1990,
  gender: 1,
  runningExperience: 1,
  usuallyTravelRace: 1,
  phoneCountryCode: '+1',
  phoneNumber: '1234567890',
  cars: [mockCarEntity()],
  preferredRaceTypes: [],
  preferredDistances: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('TripService', () => {
  let service: TripService;
  let tripRepository: jest.Mocked<Repository<TripEntity>>;
  let tripPassengerRepository: jest.Mocked<Repository<TripPassengerEntity>>;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let raceRepository: jest.Mocked<Repository<RaceEntity>>;
  let carRepository: jest.Mocked<Repository<CarEntity>>;
  let userProfileRepository: jest.Mocked<Repository<UserProfileEntity>>;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(async () => {
    // Mock QueryRunner
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    // Mock Connection
    const mockConnection = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getRepositoryToken(TripEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn(),
            manager: {
              connection: mockConnection,
            },
          },
        },
        {
          provide: getRepositoryToken(TripPassengerEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RaceEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CarEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserProfileEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TripService>(TripService);
    tripRepository = module.get(getRepositoryToken(TripEntity));
    tripPassengerRepository = module.get(getRepositoryToken(TripPassengerEntity));
    userRepository = module.get(getRepositoryToken(UserEntity));
    raceRepository = module.get(getRepositoryToken(RaceEntity));
    carRepository = module.get(getRepositoryToken(CarEntity));
    userProfileRepository = module.get(getRepositoryToken(UserProfileEntity));

    // Setup default mock for userProfileRepository (with valid car)
    userProfileRepository.findOne.mockResolvedValue(mockUserProfileEntity());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a trip and automatically add driver as passenger', async () => {
      // Arrange
      const createTripDto = mockCreateTripDto();
      const driver = mockUserEntity();
      const race = mockRaceEntity();
      const userProfile = mockUserProfileEntity();
      const savedTrip = mockTripEntity();
      const driverAsPassenger = mockTripPassengerEntity();

      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(race);
      userProfileRepository.findOne.mockResolvedValue(userProfile);
      tripRepository.create.mockReturnValue(savedTrip);
      tripPassengerRepository.create.mockReturnValue(driverAsPassenger);
      (mockQueryRunner.manager.save as jest.Mock)
        .mockResolvedValueOnce(savedTrip)
        .mockResolvedValueOnce(driverAsPassenger);

      // Mock findOneWithPassengers
      const tripWithPassengers = {
        ...savedTrip,
        passengers: [driverAsPassenger],
      };
      tripRepository.findOne.mockResolvedValue(tripWithPassengers as any);

      // Act
      const result = await service.create(createTripDto);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: createTripDto.driverId },
      });
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: createTripDto.raceId },
      });
      expect(userProfileRepository.findOne).toHaveBeenCalledWith({
        where: { 
          user: { id: createTripDto.driverId },
          deletedAt: IsNull()
        },
        relations: ['cars']
      });
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(tripRepository.create).toHaveBeenCalledWith({
        ...createTripDto,
        driver,
        race,
        car: userProfile.cars[0],
      });
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(TripEntity, savedTrip);
      expect(tripPassengerRepository.create).toHaveBeenCalledWith({
        trip: savedTrip,
        passenger: driver,
      });
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(TripPassengerEntity, driverAsPassenger);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when driver not found', async () => {
      // Arrange
      const createTripDto = mockCreateTripDto();
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createTripDto)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: createTripDto.driverId },
      });
    });

    it('should throw NotFoundException when race not found', async () => {
      // Arrange
      const createTripDto = mockCreateTripDto();
      const driver = mockUserEntity();
      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createTripDto)).rejects.toThrow(NotFoundException);
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: createTripDto.raceId },
      });
    });

    it('should throw NotFoundException when driver profile not found', async () => {
      // Arrange
      const createTripDto = mockCreateTripDto();
      const driver = mockUserEntity();
      const race = mockRaceEntity();

      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(race);
      userProfileRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createTripDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createTripDto)).rejects.toThrow('Driver profile not found');
    });

    it('should throw BadRequestException when driver has no cars', async () => {
      // Arrange
      const createTripDto = mockCreateTripDto();
      const driver = mockUserEntity();
      const race = mockRaceEntity();
      const userProfileWithoutCars = { ...mockUserProfileEntity(), cars: [] };

      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(race);
      userProfileRepository.findOne.mockResolvedValue(userProfileWithoutCars);

      // Act & Assert
      await expect(service.create(createTripDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createTripDto)).rejects.toThrow('Driver must have at least one car registered');
    });

    it('should throw BadRequestException when driver has no active cars', async () => {
      // Arrange
      const createTripDto = mockCreateTripDto();
      const driver = mockUserEntity();
      const race = mockRaceEntity();
      const deletedCar = { ...mockCarEntity(), deletedAt: new Date() };
      const userProfileWithDeletedCars = { ...mockUserProfileEntity(), cars: [deletedCar] };

      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(race);
      userProfileRepository.findOne.mockResolvedValue(userProfileWithDeletedCars);

      // Act & Assert
      await expect(service.create(createTripDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createTripDto)).rejects.toThrow('Driver must have at least one active car');
    });

    it('should throw BadRequestException when departure date is in the past', async () => {
      // Arrange
      const createTripDto = {
        ...mockCreateTripDto(),
        departureDay: '2020-01-01', // Past date
        departureHour: '10:00',
      };
      const driver = mockUserEntity();
      const race = mockRaceEntity();
      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(race);

      // Act & Assert
      await expect(service.create(createTripDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when seats is less than 1', async () => {
      // Arrange
      const createTripDto = {
        ...mockCreateTripDto(),
        seats: 0,
      };
      const driver = mockUserEntity();
      const race = mockRaceEntity();
      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(race);

      // Act & Assert
      await expect(service.create(createTripDto)).rejects.toThrow(BadRequestException);
    });

    it('should calculate availableSeats correctly', async () => {
      // Arrange
      const createTripDto = mockCreateTripDto();
      const driver = mockUserEntity();
      const race = mockRaceEntity();
      const savedTrip = mockTripEntity({ seats: 4 });
      const driverAsPassenger = mockTripPassengerEntity();

      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(race);
      tripRepository.create.mockReturnValue(savedTrip);
      tripPassengerRepository.create.mockReturnValue(driverAsPassenger);
      (mockQueryRunner.manager.save as jest.Mock)
        .mockResolvedValueOnce(savedTrip)
        .mockResolvedValueOnce(driverAsPassenger);

      // Mock findOneWithPassengers to return trip with 1 passenger (the driver)
      const tripWithPassengers = {
        ...savedTrip,
        passengers: [driverAsPassenger],
      };
      tripRepository.findOne.mockResolvedValue(tripWithPassengers as any);

      // Act
      const result = await service.create(createTripDto);

      // Assert
      expect(result.seats).toBe(4);
      expect(result.availableSeats).toBe(3); // 4 total - 1 passenger (driver) = 3 available
      expect(result.passengers).toHaveLength(1);
    });

    it('should rollback transaction on error', async () => {
      // Arrange
      const createTripDto = mockCreateTripDto();
      const driver = mockUserEntity();
      const race = mockRaceEntity();
      const savedTrip = mockTripEntity();

      userRepository.findOne.mockResolvedValue(driver);
      raceRepository.findOne.mockResolvedValue(race);
      tripRepository.create.mockReturnValue(savedTrip);
      (mockQueryRunner.manager.save as jest.Mock).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.create(createTripDto)).rejects.toThrow('Database error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('joinTrip', () => {
    it('should allow a user to join a trip', async () => {
      // Arrange
      const joinTripDto = { tripId: 1, passengerId: 2 };
      const trip = {
        ...mockTripEntity(),
        passengers: [],
        seats: 4,
      };
      const passenger = mockUserEntity({ id: 2 });
      const tripPassenger = mockTripPassengerEntity();

      tripRepository.findOne.mockResolvedValue(trip as any);
      userRepository.findOne.mockResolvedValue(passenger);
      tripPassengerRepository.create.mockReturnValue(tripPassenger);
      tripPassengerRepository.save.mockResolvedValue(tripPassenger);

      // Act
      const result = await service.joinTrip(joinTripDto);

      // Assert
      expect(tripRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: IsNull() },
        relations: ['driver', 'passengers', 'passengers.passenger'],
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(tripPassengerRepository.create).toHaveBeenCalledWith({
        trip,
        passenger,
      });
      expect(tripPassengerRepository.save).toHaveBeenCalledWith(tripPassenger);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when trip is full', async () => {
      // Arrange
      const joinTripDto = { tripId: 1, passengerId: 2 };
      const mockPassengers = Array(4).fill(mockTripPassengerEntity());
      const trip = {
        ...mockTripEntity(),
        passengers: mockPassengers,
        seats: 4,
      };
      const passenger = mockUserEntity({ id: 2 });

      tripRepository.findOne.mockResolvedValue(trip as any);
      userRepository.findOne.mockResolvedValue(passenger);

      // Act & Assert
      await expect(service.joinTrip(joinTripDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user already joined trip', async () => {
      // Arrange
      const joinTripDto = { tripId: 1, passengerId: 2 };
      const existingPassenger = mockTripPassengerEntity({ 
        passenger: mockUserEntity({ id: 2 }),
        deletedAt: undefined 
      });
      const trip = {
        ...mockTripEntity(),
        passengers: [existingPassenger],
        seats: 4,
      };
      const passenger = mockUserEntity({ id: 2 });

      tripRepository.findOne.mockResolvedValue(trip as any);
      userRepository.findOne.mockResolvedValue(passenger);

      // Act & Assert
      await expect(service.joinTrip(joinTripDto)).rejects.toThrow(BadRequestException);
    });

    it('should reactivate a previously cancelled reservation', async () => {
      // Arrange
      const joinTripDto = { tripId: 1, passengerId: 2 };
      const deletedPassenger = mockTripPassengerEntity({ 
        id: 1,
        passenger: mockUserEntity({ id: 2 }),
        deletedAt: new Date('2023-01-01') 
      });
      const trip = {
        ...mockTripEntity(),
        passengers: [deletedPassenger],
        seats: 4,
      };
      const passenger = mockUserEntity({ id: 2 });

      tripRepository.findOne.mockResolvedValue(trip as any);
      userRepository.findOne.mockResolvedValue(passenger);
      tripPassengerRepository.update.mockResolvedValue({} as any);

      // Act
      const result = await service.joinTrip(joinTripDto);

      // Assert
      expect(tripPassengerRepository.update).toHaveBeenCalledWith(
        1,
        { deletedAt: undefined, updatedAt: expect.any(Date) }
      );
      expect(result).toBeDefined();
    });
  });

  describe('leaveTrip', () => {
    it('should allow a passenger to leave a trip', async () => {
      // Arrange
      const tripId = 1;
      const passengerId = 2;
      const tripPassenger = {
        ...mockTripPassengerEntity(),
        trip: { ...mockTripEntity(), driver: mockUserEntity({ id: 3 }) },
      };

      tripPassengerRepository.findOne.mockResolvedValue(tripPassenger as any);
      tripPassengerRepository.update.mockResolvedValue({} as any);

      // Act
      await service.leaveTrip(tripId, passengerId);

      // Assert
      expect(tripPassengerRepository.findOne).toHaveBeenCalledWith({
        where: {
          trip: { id: tripId },
          passenger: { id: passengerId },
          deletedAt: IsNull(),
        },
        relations: ['trip', 'trip.driver'],
      });
      expect(tripPassengerRepository.update).toHaveBeenCalledWith(
        tripPassenger.id,
        { deletedAt: expect.any(Date) }
      );
    });

    it('should throw BadRequestException when driver tries to leave their own trip', async () => {
      // Arrange
      const tripId = 1;
      const passengerId = 2;
      const tripPassenger = {
        ...mockTripPassengerEntity(),
        trip: { ...mockTripEntity(), driver: mockUserEntity({ id: 2 }) }, // Driver same as passenger
      };

      tripPassengerRepository.findOne.mockResolvedValue(tripPassenger as any);

      // Act & Assert
      await expect(service.leaveTrip(tripId, passengerId)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when passenger not found in trip', async () => {
      // Arrange
      const tripId = 1;
      const passengerId = 2;

      tripPassengerRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.leaveTrip(tripId, passengerId)).rejects.toThrow(NotFoundException);
    });
  });
});