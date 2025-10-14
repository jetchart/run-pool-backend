import { TripEntity } from '../entities/trip.entity';
import { mockUserEntity } from '../../user/fixtures/mock-user-entity';
import { mockRaceEntity } from '../../race/fixtures/mock-race-entity';
import { CarEntity } from '../../user/entities/car.entity';

const mockCarEntity = (): CarEntity => ({
  id: 1,
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  color: 'Blue',
  seats: 5,
  licensePlate: 'ABC123',
  userProfile: {} as any,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const mockTripEntity = (overrides?: Partial<TripEntity>): TripEntity => {
  const trip = new TripEntity();
  trip.id = 1;
  trip.driver = mockUserEntity();
  trip.race = mockRaceEntity();
  trip.car = mockCarEntity();
  trip.departureDay = new Date('2026-12-25');
  trip.departureHour = '08:30';
  trip.departureCity = 'Buenos Aires';
  trip.departureProvince = 'Buenos Aires';
  trip.arrivalCity = 'La Plata';
  trip.arrivalProvince = 'Buenos Aires';
  trip.description = 'Viaje a carrera 10K';
  trip.seats = 4;
  trip.passengers = [];
  trip.createdAt = new Date('2025-10-13T10:00:00Z');
  trip.deletedAt = undefined;

  return Object.assign(trip, overrides);
};