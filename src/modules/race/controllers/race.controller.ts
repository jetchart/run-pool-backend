import { Body, Controller, Get, Post, Param, ParseIntPipe, UsePipes, ValidationPipe, Put, Delete } from '@nestjs/common';
import { RaceService } from '../services/race.service';
import { CreateRaceDto } from '../dtos/create-race.dto';
import { RaceEntity } from '../entities/race.entity';
import { UpdateRaceDto } from '../dtos/update-race.dto';

@Controller('races')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Get()
  async findAll(): Promise<RaceEntity[]> {
    return this.raceService.findAll();
  }

  @Get('past-or-today')
  async findPastOrToday(): Promise<RaceEntity[]> {
    return this.raceService.findPastOrToday();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RaceEntity> {
    return this.raceService.findOne(id);
  }

  @Post()
  async create(@Body() createRaceDto: CreateRaceDto): Promise<RaceEntity> {
    return this.raceService.create(createRaceDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRaceDto: UpdateRaceDto,
  ): Promise<RaceEntity> {
    return this.raceService.update(id, updateRaceDto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.raceService.softDelete(id);
  }

}
