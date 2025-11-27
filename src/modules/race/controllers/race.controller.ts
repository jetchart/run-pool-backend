import { Body, Controller, Get, Post, Param, ParseIntPipe, UsePipes, ValidationPipe, Put, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('files', 2))
  async create(
    @Body() createRaceDto: any,
    @UploadedFiles() files: any[],
  ): Promise<RaceEntity> {
    // files[0] = image, files[1] = imageThumbnail
    return this.raceService.create({ ...createRaceDto, raceDistances: JSON.parse(createRaceDto.raceDistances) }, files);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 2))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRaceDto: any,
    @UploadedFiles() files: any[],
  ): Promise<RaceEntity> {
    // files[0] = image, files[1] = imageThumbnail
    return this.raceService.update(id, { ...updateRaceDto, raceDistances: JSON.parse(updateRaceDto.raceDistances) }, files);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.raceService.softDelete(id);
  }

}
