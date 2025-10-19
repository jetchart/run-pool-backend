import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RaceController } from './race.controller';
import { RaceService } from '../services/race.service';
import { CreateRaceDto } from '../dtos/create-race.dto';
import { mockRaceWithDistances } from '../fixtures/mock-race-with-distances';
import { mockRace } from '../fixtures/mock-race';
import { mockCreateRaceDto } from '../fixtures/mock-create-race-dto';

describe('RaceController', () => {
  let controller: RaceController;
  let raceService: jest.Mocked<RaceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaceController],
      providers: [
        {
          provide: RaceService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RaceController>(RaceController);
    raceService = module.get(RaceService) as jest.Mocked<RaceService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all races', async () => {
      const mockRaces = [mockRaceWithDistances, { ...mockRace, id: 2 }];
      raceService.findAll.mockResolvedValue(mockRaces);

      const result = await controller.findAll();

      expect(result).toEqual(mockRaces);
      expect(raceService.findAll).toHaveBeenCalledTimes(1);
      expect(raceService.findAll).toHaveBeenCalledWith();
    });

    it('should return empty array when no races exist', async () => {
      raceService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(raceService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      raceService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Service error');
      expect(raceService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a race by id', async () => {
      const raceId = 1;
      raceService.findOne.mockResolvedValue(mockRaceWithDistances);

      const result = await controller.findOne(raceId);

      expect(result).toEqual(mockRaceWithDistances);
      expect(raceService.findOne).toHaveBeenCalledTimes(1);
      expect(raceService.findOne).toHaveBeenCalledWith(raceId);
    });

    it('should throw NotFoundException when race does not exist', async () => {
      const raceId = 999;
      raceService.findOne.mockRejectedValue(new NotFoundException(`Race with ID ${raceId} not found`));

      await expect(controller.findOne(raceId)).rejects.toThrow(NotFoundException);
      await expect(controller.findOne(raceId)).rejects.toThrow(`Race with ID ${raceId} not found`);
      expect(raceService.findOne).toHaveBeenCalledTimes(2);
      expect(raceService.findOne).toHaveBeenCalledWith(raceId);
    });

    it('should handle service errors', async () => {
      const raceId = 1;
      const error = new Error('Database connection error');
      raceService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(raceId)).rejects.toThrow('Database connection error');
      expect(raceService.findOne).toHaveBeenCalledTimes(1);
      expect(raceService.findOne).toHaveBeenCalledWith(raceId);
    });

    it('should handle invalid id parameter', async () => {
      const invalidId = -1;
      raceService.findOne.mockRejectedValue(new NotFoundException(`Race with ID ${invalidId} not found`));

      await expect(controller.findOne(invalidId)).rejects.toThrow(NotFoundException);
      expect(raceService.findOne).toHaveBeenCalledWith(invalidId);
    });
  });

  describe('create', () => {
    it('should create a race successfully', async () => {
      raceService.create.mockResolvedValue(mockRaceWithDistances);

      const result = await controller.create(mockCreateRaceDto);

      expect(result).toEqual(mockRaceWithDistances);
      expect(raceService.create).toHaveBeenCalledTimes(1);
      expect(raceService.create).toHaveBeenCalledWith(mockCreateRaceDto);
    });

    it('should create a race without distances', async () => {
      const createRaceDtoWithoutDistances: CreateRaceDto = {
        ...mockCreateRaceDto,
        raceDistances: [],
      };
      const expectedRace = { ...mockRace };

      raceService.create.mockResolvedValue(expectedRace);

      const result = await controller.create(createRaceDtoWithoutDistances);

      expect(result).toEqual(expectedRace);
      expect(raceService.create).toHaveBeenCalledTimes(1);
      expect(raceService.create).toHaveBeenCalledWith(createRaceDtoWithoutDistances);
    });

    it('should handle validation errors from service', async () => {
      const validationError = new Error('Validation failed');
      raceService.create.mockRejectedValue(validationError);

      await expect(controller.create(mockCreateRaceDto)).rejects.toThrow('Validation failed');
      expect(raceService.create).toHaveBeenCalledTimes(1);
      expect(raceService.create).toHaveBeenCalledWith(mockCreateRaceDto);
    });

    it('should handle service creation errors', async () => {
      const serviceError = new Error('Failed to save race');
      raceService.create.mockRejectedValue(serviceError);

      await expect(controller.create(mockCreateRaceDto)).rejects.toThrow('Failed to save race');
      expect(raceService.create).toHaveBeenCalledTimes(1);
    });

    it('should pass DTO validation to service', async () => {
      const invalidDto = { ...mockCreateRaceDto, name: '' }; // Invalid DTO
      const validationError = new Error('Name should not be empty');
      raceService.create.mockRejectedValue(validationError);

      await expect(controller.create(invalidDto as CreateRaceDto)).rejects.toThrow('Name should not be empty');
      expect(raceService.create).toHaveBeenCalledWith(invalidDto);
    });
  });

  describe('softDelete', () => {
    it('should call service.softDelete with correct id', async () => {
      raceService.softDelete = jest.fn().mockResolvedValue(undefined);
      await expect(controller.softDelete(1)).resolves.toBeUndefined();
      expect(raceService.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if service throws', async () => {
      raceService.softDelete = jest.fn().mockRejectedValue(new NotFoundException('Race not found'));
      await expect(controller.softDelete(999)).rejects.toThrow(NotFoundException);
      expect(raceService.softDelete).toHaveBeenCalledWith(999);
    });
  });
});