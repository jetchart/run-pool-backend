import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TripRatingService } from '../services/trip-rating.service';
import { CreateTripRatingDto } from '../dtos/create-trip-rating.dto';
import { TripRatingResponseDto } from '../dtos/trip-rating-response.dto';

@Controller('trip-ratings')
export class TripRatingController {
  constructor(private readonly tripRatingService: TripRatingService) {}

  @Post()
  async create(@Body() dto: CreateTripRatingDto): Promise<TripRatingResponseDto> {
    return this.tripRatingService.create(dto);
  }

  @Get('trip/:tripId')
  async getRatingsForTrip(@Param('tripId', ParseIntPipe) tripId: number): Promise<TripRatingResponseDto[]> {
    return this.tripRatingService.getRatingsForTrip(tripId);
  }

  @Get('user/:userId')
  async getRatingsForUser(@Param('userId', ParseIntPipe) userId: number): Promise<TripRatingResponseDto[]> {
    return this.tripRatingService.getRatingsForUser(userId);
  }
}
