import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trip.controller';
import { TripService } from '../services/trip.service';
import { CreateTripDto } from '../dtos/create-trip.dto';
import { UpdateTripDto } from '../dtos/update-trip.dto';
import { JoinTripDto } from '../dtos/join-trip.dto';

describe('TripController', () => {
  let controller: TripController;
  let service: jest.Mocked<TripService>;

  const mockTripResponse = {
    id: 1,
    driver: {
      id: 1,
      name: 'Juan Conductor',
      givenName: 'Juan',
      familyName: 'Conductor',
      email: 'juan@example.com',
      pictureUrl: 'https://example.com/juan.jpg',
    },
    race: {
      id: 1,
      name: 'Carrera 10K La Plata',
      description: 'Carrera en La Plata',
      startDate: new Date('2025-12-25'),
      endDate: new Date('2025-12-25'),
      location: 'La Plata',
      price: 0,
    },
    departureDay: new Date('2025-12-25'),
    departureHour: '08:30',
    departureCity: 'Buenos Aires',
    departureProvince: 'Buenos Aires',
    description: 'Viaje a carrera',
    seats: 4,
    availableSeats: 3,
    passengers: [
      {
        id: 1,
        passenger: {
          id: 1,
          name: 'Juan Conductor',
          givenName: 'Juan',
          familyName: 'Conductor',
          email: 'juan@example.com',
          pictureUrl: 'https://example.com/juan.jpg',
        },
      },
    ],
    createdAt: new Date(),
    deletedAt: undefined,
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByRace: jest.fn(),
      findByDriver: jest.fn(),
      findByPassenger: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      joinTrip: jest.fn(),
      leaveTrip: jest.fn(),
      getPassengersByTrip: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [
        {
          provide: TripService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TripController>(TripController);
    service = module.get(TripService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a trip and return response with availableSeats', async () => {
      // Arrange
      const createTripDto: CreateTripDto = {
        driverId: 1,
        raceId: 1,
        departureDay: '2025-12-25',
        departureHour: '08:30',
        departureCity: 'Buenos Aires',
        departureProvince: 'Buenos Aires',
        description: 'Viaje a carrera',
        seats: 4,
      };

      service.create.mockResolvedValue(mockTripResponse);

      // Act
      const result = await controller.create(createTripDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createTripDto);
      expect(result).toEqual(mockTripResponse);
      expect(result.seats).toBe(4);
      expect(result.availableSeats).toBe(3);
      expect(result.passengers).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return all trips with availableSeats', async () => {
      // Arrange
      service.findAll.mockResolvedValue([mockTripResponse]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockTripResponse]);
      expect(result[0].availableSeats).toBe(3);
    });

    it('should filter by raceId when provided', async () => {
      // Arrange
      const raceId = 1;
      service.findByRace.mockResolvedValue([mockTripResponse]);

      // Act
      const result = await controller.findAll(raceId);

      // Assert
      expect(service.findByRace).toHaveBeenCalledWith(raceId);
      expect(result[0].availableSeats).toBe(3);
    });
  });

  describe('findOne', () => {
    it('should return a trip with availableSeats', async () => {
      // Arrange
      const tripId = 1;
      service.findOne.mockResolvedValue(mockTripResponse);

      // Act
      const result = await controller.findOne(tripId);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(tripId);
      expect(result.availableSeats).toBe(3);
    });
  });

  describe('update', () => {
    it('should update trip (without seats field) and return updated trip', async () => {
      // Arrange
      const tripId = 1;
      const updateTripDto: UpdateTripDto = {
        departureHour: '09:00',
        description: 'Updated description',
      };

      service.update.mockResolvedValue(mockTripResponse);

      // Act
      const result = await controller.update(tripId, updateTripDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(tripId, updateTripDto);
      expect(result.availableSeats).toBe(3);
      expect(updateTripDto).not.toHaveProperty('seats'); // seats should not be in update DTO
    });
  });

  describe('joinTrip', () => {
    it('should join trip and maintain availableSeats calculation', async () => {
      // Arrange
      const joinTripDto: JoinTripDto = {
        tripId: 1,
        passengerId: 2,
      };

      const mockTripPassengerResponse = {
        id: 2,
        passenger: {
          id: 2,
          name: 'María Pasajera',
          givenName: 'María',
          familyName: 'Pasajera',
          email: 'maria@example.com',
          pictureUrl: 'https://example.com/maria.jpg',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      };

      service.joinTrip.mockResolvedValue(mockTripPassengerResponse);

      // Act
      const result = await controller.joinTrip(joinTripDto);

      // Assert
      expect(service.joinTrip).toHaveBeenCalledWith(joinTripDto);
      expect(result).toEqual(mockTripPassengerResponse);
    });
  });

  describe('remove', () => {
    it('should remove trip', async () => {
      // Arrange
      const tripId = 1;
      service.remove.mockResolvedValue(undefined);

      // Act
      await controller.remove(tripId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(tripId);
    });
  });

  describe('leaveTrip', () => {
    it('should leave trip', async () => {
      // Arrange
      const tripId = 1;
      const passengerId = 2;
      service.leaveTrip.mockResolvedValue(undefined);

      // Act
      await controller.leaveTrip(tripId, passengerId);

      // Assert
      expect(service.leaveTrip).toHaveBeenCalledWith(tripId, passengerId);
    });
  });

  describe('getPassengersByTrip', () => {
    it('should get passengers by trip', async () => {
      // Arrange
      const tripId = 1;
      const mockPassengers = [
        {
          id: 1,
          passenger: {
            id: 1,
            name: 'Juan Conductor',
            givenName: 'Juan',
            familyName: 'Conductor',
            email: 'juan@example.com',
            pictureUrl: 'https://example.com/juan.jpg',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: undefined,
        },
      ];

      service.getPassengersByTrip.mockResolvedValue(mockPassengers);

      // Act
      const result = await controller.getPassengersByTrip(tripId);

      // Assert
      expect(service.getPassengersByTrip).toHaveBeenCalledWith(tripId);
      expect(result).toEqual(mockPassengers);
    });
  });
});