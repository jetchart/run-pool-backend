import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RaceService } from '../services/race.service';
import { CreateRaceDto } from '../dtos/create-race.dto';
import { RaceEntity } from '../entities/race.entity';

@Controller('races')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Get()
  async findAll(): Promise<RaceEntity[]> {
    return this.raceService.findAll();
  }

  @Post()
  async create(@Body() createRaceDto: CreateRaceDto): Promise<RaceEntity> {
    return this.raceService.create(createRaceDto);
  }
}
