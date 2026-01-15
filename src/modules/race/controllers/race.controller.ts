import { Body, Controller, Get, Post, Param, ParseIntPipe, UsePipes, ValidationPipe, Put, Delete, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RaceService } from '../services/race.service';
import { CreateRaceDto } from '../dtos/create-race.dto';
import { RaceEntity } from '../entities/race.entity';
import { UpdateRaceDto } from '../dtos/update-race.dto';

@Controller('races')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '9'
  ): Promise<{ data: RaceEntity[]; total: number; page: number; limit: number }> {
    const pageNum = parseInt(page, 9) || 1;
    const limitNum = parseInt(limit, 9) || 9;
    return this.raceService.findAllPaginated(pageNum, limitNum);
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
    if (!files || files.length != 2) throw new BadRequestException('Enviar image principal y la image thumbnail');
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
