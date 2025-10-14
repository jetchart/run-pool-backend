import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RaceService } from './race.service';
import { RaceEntity } from '../entities/race.entity';
import { RaceDistanceEntity } from '../entities/race-distance.entity';
import { validateOrReject } from 'class-validator';
import { mockRace } from '../fixtures/mock-race';
import { mockRaceWithDistances } from '../fixtures/mock-race-with-distances';
import { mockCreateRaceDto } from '../fixtures/mock-create-race-dto';
import { mockRaceDistance } from '../fixtures/mock-race-distance';

jest.mock('class-validator', () => ({
  validateOrReject: jest.fn(),
}));

describe('RaceService', () => {
  let service: RaceService;
  let raceRepository: jest.Mocked<Repository<RaceEntity>>;
  let raceDistanceRepository: jest.Mocked<Repository<RaceDistanceEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaceService,
        {
          provide: getRepositoryToken(RaceEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RaceDistanceEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RaceService>(RaceService);
    raceRepository = module.get(getRepositoryToken(RaceEntity));
    raceDistanceRepository = module.get(getRepositoryToken(RaceDistanceEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all races with distances ordered by startDate', async () => {
      const mockRaces = [mockRaceWithDistances, { ...mockRace, id: 2, startDate: '2024-07-01' }];
      raceRepository.find.mockResolvedValue(mockRaces);

      const result = await service.findAll();

      expect(result).toEqual(mockRaces);
      expect(raceRepository.find).toHaveBeenCalledWith({
        relations: ['distances'],
        order: { startDate: 'ASC' },
      });
    });

    it('should return empty array when no races exist', async () => {
      raceRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(raceRepository.find).toHaveBeenCalledWith({
        relations: ['distances'],
        order: { startDate: 'ASC' },
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      raceRepository.find.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('findOne', () => {
    it('should return a race by id with distances', async () => {
      const raceId = 1;
      raceRepository.findOne.mockResolvedValue(mockRaceWithDistances);

      const result = await service.findOne(raceId);

      expect(result).toEqual(mockRaceWithDistances);
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: raceId },
        relations: ['distances', 'distances.distance'],
      });
    });

    it('should throw NotFoundException when race does not exist', async () => {
      const raceId = 999;
      raceRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(raceId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(raceId)).rejects.toThrow(`Race with ID ${raceId} not found`);
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: raceId },
        relations: ['distances', 'distances.distance'],
      });
    });

    it('should handle database errors', async () => {
      const raceId = 1;
      const dbError = new Error('Database connection failed');
      raceRepository.findOne.mockRejectedValue(dbError);

      await expect(service.findOne(raceId)).rejects.toThrow('Database connection failed');
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: raceId },
        relations: ['distances', 'distances.distance'],
      });
    });

    it('should return race without distances when none exist', async () => {
      const raceId = 1;
      const raceWithoutDistances = { ...mockRace, distances: [] };
      raceRepository.findOne.mockResolvedValue(raceWithoutDistances);

      const result = await service.findOne(raceId);

      expect(result).toEqual(raceWithoutDistances);
      expect(result.distances).toEqual([]);
    });
  });

  describe('create', () => {
    const mockedValidateOrReject = validateOrReject as jest.MockedFunction<typeof validateOrReject>;

    beforeEach(() => {
      mockedValidateOrReject.mockResolvedValue();
    });

    it('should create a race with distances successfully', async () => {
      const { raceDistances, ...raceData } = mockCreateRaceDto;
      const savedRace = { ...mockRace, id: 1 };
      const raceDistanceEntity = { ...mockRaceDistance };

      raceRepository.create.mockReturnValue(mockRace);
      raceRepository.save.mockResolvedValue(savedRace);
      raceDistanceRepository.create.mockReturnValue(raceDistanceEntity);
      raceDistanceRepository.save.mockResolvedValue([raceDistanceEntity] as any);
      raceRepository.findOne.mockResolvedValue(mockRaceWithDistances);

      const result = await service.create(mockCreateRaceDto);

      expect(mockedValidateOrReject).toHaveBeenCalledWith(mockCreateRaceDto);
      expect(raceRepository.create).toHaveBeenCalledWith(raceData);
      expect(raceRepository.save).toHaveBeenCalledWith(mockRace);
      expect(raceDistanceRepository.create).toHaveBeenCalledWith({
        race: savedRace,
        distance: { id: 1 },
      });
      expect(raceDistanceRepository.save).toHaveBeenCalledWith([raceDistanceEntity]);
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: savedRace.id },
        relations: ['distances', 'distances.distance'],
      });
      expect(result).toEqual(mockRaceWithDistances);
    });

    it('should create a race without distances', async () => {
      const createRaceDtoWithoutDistances = { ...mockCreateRaceDto, raceDistances: [] };
      const { raceDistances, ...raceData } = createRaceDtoWithoutDistances;
      const savedRace = { ...mockRace, id: 1 };

      raceRepository.create.mockReturnValue(mockRace);
      raceRepository.save.mockResolvedValue(savedRace);
      raceRepository.findOne.mockResolvedValue(mockRace);

      const result = await service.create(createRaceDtoWithoutDistances);

      expect(mockedValidateOrReject).toHaveBeenCalledWith(createRaceDtoWithoutDistances);
      expect(raceRepository.create).toHaveBeenCalledWith(raceData);
      expect(raceRepository.save).toHaveBeenCalledWith(mockRace);
      expect(raceDistanceRepository.create).not.toHaveBeenCalled();
      expect(raceDistanceRepository.save).not.toHaveBeenCalled();
      expect(raceRepository.findOne).toHaveBeenCalledWith({
        where: { id: savedRace.id },
        relations: ['distances', 'distances.distance'],
      });
      expect(result).toEqual(mockRace);
    });

    it('should create a race with multiple distances', async () => {
      const multipleDistancesDto = {
        ...mockCreateRaceDto,
        raceDistances: [{ distanceId: 1 }, { distanceId: 2 }],
      };
      const { raceDistances, ...raceData } = multipleDistancesDto;
      const savedRace = { ...mockRace, id: 1 };
      const mockDistance2 = {
        id: 2,
        description: '21 kilometers distance',
        shortDescription: '21K',
        kilometers: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
        races: [],
      };

      const raceDistanceEntities = [
        { ...mockRaceDistance, id: 1 },
        { ...mockRaceDistance, id: 2, distance: mockDistance2 },
      ];

      raceRepository.create.mockReturnValue(mockRace);
      raceRepository.save.mockResolvedValue(savedRace);
      raceDistanceRepository.create.mockReturnValueOnce(raceDistanceEntities[0] as any)
        .mockReturnValueOnce(raceDistanceEntities[1] as any);
      raceDistanceRepository.save.mockResolvedValue(raceDistanceEntities as any);
      raceRepository.findOne.mockResolvedValue({
        ...mockRaceWithDistances,
        distances: raceDistanceEntities,
      });

      const result = await service.create(multipleDistancesDto);

      expect(raceDistanceRepository.create).toHaveBeenCalledTimes(2);
      expect(raceDistanceRepository.create).toHaveBeenNthCalledWith(1, {
        race: savedRace,
        distance: { id: 1 },
      });
      expect(raceDistanceRepository.create).toHaveBeenNthCalledWith(2, {
        race: savedRace,
        distance: { id: 2 },
      });
      expect(raceDistanceRepository.save).toHaveBeenCalledWith(raceDistanceEntities);
      expect(result.distances).toHaveLength(2);
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed');
      mockedValidateOrReject.mockRejectedValue(validationError);

      await expect(service.create(mockCreateRaceDto)).rejects.toThrow('Validation failed');

      expect(raceRepository.create).not.toHaveBeenCalled();
      expect(raceRepository.save).not.toHaveBeenCalled();
    });

    it('should handle race save errors', async () => {
      const { raceDistances, ...raceData } = mockCreateRaceDto;
      const saveError = new Error('Failed to save race');

      raceRepository.create.mockReturnValue(mockRace);
      raceRepository.save.mockRejectedValue(saveError);

      await expect(service.create(mockCreateRaceDto)).rejects.toThrow('Failed to save race');

      expect(raceRepository.create).toHaveBeenCalledWith(raceData);
      expect(raceDistanceRepository.create).not.toHaveBeenCalled();
    });

    it('should handle race distance save errors', async () => {
      const { raceDistances, ...raceData } = mockCreateRaceDto;
      const savedRace = { ...mockRace, id: 1 };
      const raceDistanceEntity = { ...mockRaceDistance };
      const saveError = new Error('Failed to save race distances');

      raceRepository.create.mockReturnValue(mockRace);
      raceRepository.save.mockResolvedValue(savedRace);
      raceDistanceRepository.create.mockReturnValue(raceDistanceEntity);
      raceDistanceRepository.save.mockRejectedValue(saveError);

      await expect(service.create(mockCreateRaceDto)).rejects.toThrow('Failed to save race distances');

      expect(raceRepository.create).toHaveBeenCalledWith(raceData);
      expect(raceRepository.save).toHaveBeenCalledWith(mockRace);
      expect(raceDistanceRepository.create).toHaveBeenCalled();
    });

    it('should handle final findOne errors', async () => {
      const { raceDistances, ...raceData } = mockCreateRaceDto;
      const savedRace = { ...mockRace, id: 1 };
      const raceDistanceEntity = { ...mockRaceDistance };
      const findError = new Error('Failed to find created race');

      raceRepository.create.mockReturnValue(mockRace);
      raceRepository.save.mockResolvedValue(savedRace);
      raceDistanceRepository.create.mockReturnValue(raceDistanceEntity);
      raceDistanceRepository.save.mockResolvedValue([raceDistanceEntity] as any);
      raceRepository.findOne.mockRejectedValue(findError);

      await expect(service.create(mockCreateRaceDto)).rejects.toThrow('Failed to find created race');
    });
  });
});