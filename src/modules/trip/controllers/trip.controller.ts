import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TripService } from '../services/trip.service';
import { CreateTripDto } from '../dtos/create-trip.dto';
import { UpdateTripDto } from '../dtos/update-trip.dto';
import { JoinTripDto } from '../dtos/join-trip.dto';
import { TripResponse } from '../dtos/trip-response.dto';
import { TripPassengerResponse } from '../dtos/trip-passenger-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTripDto: CreateTripDto): Promise<TripResponse> {
    return this.tripService.create(createTripDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('raceId', ParseIntPipe) raceId: number,
  ): Promise<TripResponse[]> {
    return this.tripService.findByRace(raceId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('passenger/:passengerId')
  findByPassenger(
    @Param('passengerId', ParseIntPipe) passengerId: number,
  ): Promise<TripResponse[]> {
    return this.tripService.findByPassenger(passengerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TripResponse> {
    return this.tripService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTripDto: UpdateTripDto,
  ): Promise<TripResponse> {
    return this.tripService.update(id, updateTripDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tripService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('join')
  joinTrip(@Body() joinTripDto: JoinTripDto): Promise<TripPassengerResponse> {
    return this.tripService.joinTrip(joinTripDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':tripId/passengers/:passengerId')
  leaveTrip(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('passengerId', ParseIntPipe) passengerId: number,
  ): Promise<void> {
    return this.tripService.leaveTrip(tripId, passengerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/passengers')
  getPassengersByTrip(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TripPassengerResponse[]> {
    return this.tripService.getPassengersByTrip(id);
  }
}