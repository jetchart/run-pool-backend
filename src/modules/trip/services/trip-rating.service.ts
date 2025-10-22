import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripRatingEntity } from '../entities/trip-rating.entity';
import { TripEntity } from '../entities/trip.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { CreateTripRatingDto } from '../dtos/create-trip-rating.dto';
import { TripRatingResponseDto } from '../dtos/trip-rating-response.dto';

@Injectable()
export class TripRatingService {
  constructor(
    @InjectRepository(TripRatingEntity)
    private readonly tripRatingRepository: Repository<TripRatingEntity>,
    @InjectRepository(TripEntity)
    private readonly tripRepository: Repository<TripEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateTripRatingDto): Promise<TripRatingResponseDto> {
    const trip = await this.tripRepository.findOne({ where: { id: dto.tripId } });
    if (!trip) throw new NotFoundException('Viaje no encontrado');

    const rater = await this.userRepository.findOne({ where: { id: dto.raterId } });
    if (!rater) throw new NotFoundException('Usuario que califica no encontrado');

    const rated = await this.userRepository.findOne({ where: { id: dto.ratedId } });
    if (!rated) throw new NotFoundException('Usuario calificado no encontrado');

    // Validar que no se califique a sí mismo
    if (dto.raterId === dto.ratedId) {
      throw new BadRequestException('No puedes calificarte a ti mismo');
    }

    // Validar que no exista ya una calificación igual
    const existing = await this.tripRatingRepository.findOne({
      where: { trip: { id: dto.tripId }, rater: { id: dto.raterId }, rated: { id: dto.ratedId } },
    });
    if (existing) throw new BadRequestException('Ya existe una calificación para este usuario en este viaje');

    const entity = this.tripRatingRepository.create({
      trip,
      rater,
      rated,
      type: dto.type,
      rating: dto.rating,
      comment: dto.comment,
    });
    const saved = await this.tripRatingRepository.save(entity);
    return this.toResponse(saved);
  }

  async getRatingsForTrip(tripId: number): Promise<TripRatingResponseDto[]> {
    const ratings = await this.tripRatingRepository.find({
      where: { trip: { id: tripId } },
      relations: ['rater', 'rated', 'trip'],
    });
    return ratings.map(this.toResponse);
  }

  async getRatingsForUser(userId: number): Promise<TripRatingResponseDto[]> {
    const ratings = await this.tripRatingRepository.find({
      where: [
        { rated: { id: userId } },
      ],
      relations: ['rater', 'rated', 'trip'],
    });
    return ratings.map(this.toResponse);
  }

  private toResponse = (entity: TripRatingEntity): TripRatingResponseDto => ({
    id: entity.id,
    tripId: entity.trip.id,
    raterId: entity.rater.id,
    ratedId: entity.rated.id,
    type: entity.type,
    rating: entity.rating,
    comment: entity.comment,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  });
}
