import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TripEntity } from '../entities/trip.entity';
import { TripPassengerEntity } from '../entities/trip-passenger.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { RaceEntity } from '../../race/entities/race.entity';
import { CarEntity } from '../../user/entities/car.entity';
import { UserProfileEntity } from '../../user/entities/user-profile.entity';
import { CreateTripDto } from '../dtos/create-trip.dto';
import { UpdateTripDto } from '../dtos/update-trip.dto';
import { JoinTripDto } from '../dtos/join-trip.dto';
import { TripResponse } from '../dtos/trip-response.dto';
import { TripPassengerResponse } from '../dtos/trip-passenger-response.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepository: Repository<TripEntity>,
    @InjectRepository(TripPassengerEntity)
    private readonly tripPassengerRepository: Repository<TripPassengerEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RaceEntity)
    private readonly raceRepository: Repository<RaceEntity>,
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<TripResponse> {
    // Verificar que el conductor existe
    const driver = await this.userRepository.findOne({
      where: { id: createTripDto.driverId },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Verificar que la carrera existe
    const race = await this.raceRepository.findOne({
      where: { id: createTripDto.raceId },
    });
    if (!race) {
      throw new NotFoundException('Race not found');
    }

    // Obtener automáticamente el car del conductor (obligatorio)
    // Buscar el userProfile del driver y sus cars
    const userProfile = await this.userProfileRepository.findOne({
      where: { 
        user: { id: createTripDto.driverId },
        deletedAt: IsNull()
      },
      relations: ['cars']
    });

    if (!userProfile) {
      throw new NotFoundException('Driver profile not found');
    }

    if (!userProfile.cars || userProfile.cars.length === 0) {
      throw new BadRequestException('Driver must have at least one car registered');
    }

    // Tomar el primer car activo (no eliminado)
    const car = userProfile.cars.find(c => !c.deletedAt);
    if (!car) {
      throw new BadRequestException('Driver must have at least one active car');
    }

    // Validar que la fecha de salida no sea en el pasado
    const departureDateTime = new Date(`${createTripDto.departureDay}T${createTripDto.departureHour}`);
    if (departureDateTime < new Date()) {
      throw new BadRequestException('Departure date cannot be in the past');
    }

    // Validar que haya al menos 1 asiento
    if (createTripDto.seats < 1) {
      throw new BadRequestException('Trip must have at least 1 seat');
    }

    // Crear el viaje usando QueryRunner para transacción
    const queryRunner = this.tripRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear el viaje
      const trip = this.tripRepository.create({
        ...createTripDto,
        driver,
        race,
        car,
      });
      const savedTrip = await queryRunner.manager.save(TripEntity, trip);

      // Agregar al conductor como pasajero automáticamente
      const driverAsPassenger = this.tripPassengerRepository.create({
        trip: savedTrip as TripEntity,
        passenger: driver,
      });
      await queryRunner.manager.save(TripPassengerEntity, driverAsPassenger);

      await queryRunner.commitTransaction();

      // Retornar el viaje completo con pasajeros
      return this.findOneWithPassengers((savedTrip as TripEntity).id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<TripResponse[]> {
    const trips = await this.tripRepository
      .createQueryBuilder('trip')
      .withDeleted() // Incluir entidades soft-deleted
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.race', 'race')
      .leftJoinAndSelect('trip.car', 'car') // Incluirá cars con soft-delete
      .leftJoinAndSelect('trip.passengers', 'passengers', 'passengers.deletedAt IS NULL')
      .leftJoinAndSelect('passengers.passenger', 'passenger')
      .where('trip.deletedAt IS NULL')
      .orderBy('trip.createdAt', 'DESC')
      .getMany();

    return trips.map(this.mapToTripResponse);
  }

  async findOne(id: number): Promise<TripResponse> {
    return this.findOneWithPassengers(id);
  }

  async findByRace(raceId: number): Promise<TripResponse[]> {
    const trips = await this.tripRepository
      .createQueryBuilder('trip')
      .withDeleted() // Incluir entidades soft-deleted
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.race', 'race')
      .leftJoinAndSelect('trip.car', 'car') // Incluirá cars con soft-delete
      .leftJoinAndSelect('trip.passengers', 'passengers', 'passengers.deletedAt IS NULL')
      .leftJoinAndSelect('passengers.passenger', 'passenger')
      .where('trip.deletedAt IS NULL')
      .andWhere('race.id = :raceId', { raceId })
      .orderBy('trip.createdAt', 'DESC')
      .getMany();

    return trips.map(this.mapToTripResponse);
  }

  async findByDriver(driverId: number): Promise<TripResponse[]> {
    const trips = await this.tripRepository
      .createQueryBuilder('trip')
      .withDeleted() // Incluir entidades soft-deleted
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.race', 'race')
      .leftJoinAndSelect('trip.car', 'car') // Incluirá cars con soft-delete
      .leftJoinAndSelect('trip.passengers', 'passengers', 'passengers.deletedAt IS NULL')
      .leftJoinAndSelect('passengers.passenger', 'passenger')
      .where('trip.deletedAt IS NULL')
      .andWhere('driver.id = :driverId', { driverId })
      .orderBy('trip.createdAt', 'DESC')
      .getMany();

    return trips.map(this.mapToTripResponse);
  }

  async findByPassenger(passengerId: number): Promise<TripResponse[]> {
    // Primero obtenemos los IDs de los trips donde está el passenger
    const tripIds = await this.tripRepository
      .createQueryBuilder('trip')
      .select('trip.id')
      .leftJoin('trip.passengers', 'passengers')
      .where('trip.deletedAt IS NULL')
      .andWhere('passengers.passenger.id = :passengerId', { passengerId })
      .andWhere('passengers.deletedAt IS NULL')
      .getMany();

    if (tripIds.length === 0) {
      return [];
    }

    // Luego obtenemos los trips completos con todos sus pasajeros
    const trips = await this.tripRepository
      .createQueryBuilder('trip')
      .withDeleted() // Incluir entidades soft-deleted
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.race', 'race')
      .leftJoinAndSelect('trip.car', 'car') // Incluirá cars con soft-delete
      .leftJoinAndSelect('trip.passengers', 'passengers', 'passengers.deletedAt IS NULL')
      .leftJoinAndSelect('passengers.passenger', 'passenger')
      .where('trip.id IN (:...tripIds)', { tripIds: tripIds.map(t => t.id) })
      .orderBy('trip.createdAt', 'DESC')
      .getMany();

    return trips.map(this.mapToTripResponse);
  }

  async update(id: number, updateTripDto: UpdateTripDto): Promise<TripResponse> {
    const trip = await this.tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.race', 'race')
      .leftJoinAndSelect('trip.car', 'car') // Sin restricción de deletedAt para car
      .where('trip.id = :id', { id })
      .andWhere('trip.deletedAt IS NULL')
      .getOne();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Si se actualiza la fecha, validar que no sea en el pasado
    if (updateTripDto.departureDay || updateTripDto.departureHour) {
      const departureDay = updateTripDto.departureDay || trip.departureDay;
      const departureHour = updateTripDto.departureHour || trip.departureHour;
      const departureDateTime = new Date(`${departureDay}T${departureHour}`);
      
      if (departureDateTime < new Date()) {
        throw new BadRequestException('Departure date cannot be in the past');
      }
    }

    // Actualizar el viaje
    await this.tripRepository.update(id, updateTripDto);

    return this.findOneWithPassengers(id);
  }

  async remove(id: number): Promise<void> {
    const trip = await this.tripRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Soft delete del viaje y todos sus pasajeros
    const queryRunner = this.tripRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Soft delete de todas las reservas de pasajeros
      await queryRunner.manager.update(
        TripPassengerEntity,
        { trip: { id } },
        { deletedAt: new Date() }
      );

      // Soft delete del viaje
      await queryRunner.manager.update(
        TripEntity,
        { id },
        { deletedAt: new Date() }
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async joinTrip(joinTripDto: JoinTripDto): Promise<TripPassengerResponse> {
    const { tripId, passengerId } = joinTripDto;

    // Buscar el viaje con pasajeros
    const trip = await this.tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.car', 'car') // Sin restricción de deletedAt para car
      .leftJoinAndSelect('trip.passengers', 'passengers')
      .leftJoinAndSelect('passengers.passenger', 'passenger')
      .where('trip.id = :tripId', { tripId })
      .andWhere('trip.deletedAt IS NULL')
      .getOne();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Verificar que el usuario existe
    const passenger = await this.userRepository.findOne({
      where: { id: passengerId },
    });

    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }

    // Validar que el viaje no esté en el pasado
    const departureDateTime = new Date(`${trip.departureDay}T${trip.departureHour}`);
    if (departureDateTime < new Date()) {
      throw new BadRequestException('Cannot join a trip that has already departed');
    }

    // Contar pasajeros activos (no eliminados)
    const activePassengers = trip.passengers.filter(p => !p.deletedAt);

    // Validar capacidad
    if (activePassengers.length >= trip.seats) {
      throw new BadRequestException('Trip is full');
    }

    // Validar que no esté ya reservado (incluyendo reservas eliminadas que se pueden reactivar)
    const existingReservation = trip.passengers.find(p => p.passenger.id === passengerId);
    
    if (existingReservation) {
      if (!existingReservation.deletedAt) {
        throw new BadRequestException('User already joined this trip');
      } else {
        // Reactivar reserva eliminada
        await this.tripPassengerRepository.update(
          existingReservation.id,
          { deletedAt: undefined, updatedAt: new Date() }
        );
        
        return this.mapToTripPassengerResponse(existingReservation, passenger);
      }
    }

    // Crear nueva reserva
    const tripPassenger = this.tripPassengerRepository.create({
      trip,
      passenger,
    });

    const savedTripPassenger = await this.tripPassengerRepository.save(tripPassenger);

    return this.mapToTripPassengerResponse(savedTripPassenger, passenger);
  }

  async leaveTrip(tripId: number, passengerId: number): Promise<void> {
    const tripPassenger = await this.tripPassengerRepository.findOne({
      where: {
        trip: { id: tripId },
        passenger: { id: passengerId },
        deletedAt: IsNull(),
      },
      relations: ['trip', 'trip.driver'],
    });

    if (!tripPassenger) {
      throw new NotFoundException('Passenger not found in this trip');
    }

    // Verificar que no sea el conductor (el conductor no puede salir de su propio viaje)
    if (tripPassenger.trip.driver.id === passengerId) {
      throw new BadRequestException('Driver cannot leave their own trip. Delete the trip instead.');
    }

    // Soft delete de la reserva
    await this.tripPassengerRepository.update(tripPassenger.id, {
      deletedAt: new Date(),
    });
  }

  async getPassengersByTrip(tripId: number): Promise<TripPassengerResponse[]> {
    const tripPassengers = await this.tripPassengerRepository.find({
      where: {
        trip: { id: tripId },
        deletedAt: IsNull(),
      },
      relations: ['passenger'],
      order: { createdAt: 'ASC' },
    });

    return tripPassengers.map(tp => this.mapToTripPassengerResponse(tp, tp.passenger));
  }

  private async findOneWithPassengers(id: number): Promise<TripResponse> {
    const trip = await this.tripRepository
      .createQueryBuilder('trip')
      .withDeleted() // Incluir entidades soft-deleted
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.race', 'race')
      .leftJoinAndSelect('trip.car', 'car') // Incluirá cars con soft-delete
      .leftJoinAndSelect('trip.passengers', 'passengers', 'passengers.deletedAt IS NULL')
      .leftJoinAndSelect('passengers.passenger', 'passenger')
      .where('trip.id = :id', { id })
      .andWhere('trip.deletedAt IS NULL')
      .getOne();

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return this.mapToTripResponse(trip);
  }

  private mapToTripResponse(trip: TripEntity): TripResponse {
    const passengers = (trip.passengers?.sort((a, b) => a.id - b.id)) || [];

    return {
      id: trip.id,
      driver: {
        id: trip.driver.id,
        name: trip.driver.name,
        givenName: trip.driver.givenName,
        familyName: trip.driver.familyName,
        email: trip.driver.email,
        pictureUrl: trip.driver.pictureUrl,
      },
      race: {
        id: trip.race.id,
        name: trip.race.name,
        description: trip.race.description,
        startDate: new Date(trip.race.startDate),
        endDate: new Date(trip.race.endDate),
        location: trip.race.location,
      },
      car: {
        id: trip.car.id,
        brand: trip.car.brand,
        model: trip.car.model,
        year: trip.car.year,
        color: trip.car.color,
        seats: trip.car.seats,
        licensePlate: trip.car.licensePlate,
      },
      departureDay: trip.departureDay,
      departureHour: trip.departureHour,
      departureCity: trip.departureCity,
      departureProvince: trip.departureProvince,
      arrivalCity: trip.arrivalCity,
      arrivalProvince: trip.arrivalProvince,
      description: trip.description,
      seats: trip.seats,
      availableSeats: trip.seats - passengers.length,
      passengers: passengers.map(tp => ({
        id: tp.id,
        passenger: {
          id: tp.passenger.id,
          name: tp.passenger.name,
          givenName: tp.passenger.givenName,
          familyName: tp.passenger.familyName,
          email: tp.passenger.email,
          pictureUrl: tp.passenger.pictureUrl,
        },
      })),
      createdAt: trip.createdAt,
      deletedAt: trip.deletedAt,
    };
  }

  private mapToTripPassengerResponse(tripPassenger: TripPassengerEntity, passenger: UserEntity): TripPassengerResponse {
    return {
      id: tripPassenger.id,
      passenger: {
        id: passenger.id,
        name: passenger.name,
        givenName: passenger.givenName,
        familyName: passenger.familyName,
        email: passenger.email,
        pictureUrl: passenger.pictureUrl,
      },
      createdAt: tripPassenger.createdAt,
      updatedAt: tripPassenger.updatedAt,
      deletedAt: tripPassenger.deletedAt,
    };
  }
}