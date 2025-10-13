import { TripEntity } from '../entities/trip.entity';
import { mockUserEntity } from '../../user/fixtures/mock-user-entity';
import { mockRaceEntity } from '../../race/fixtures/mock-race-entity';

export const mockTripEntity = (overrides?: Partial<TripEntity>): TripEntity => {
  const trip = new TripEntity();
  trip.id = 1;
  trip.driver = mockUserEntity();
  trip.race = mockRaceEntity();
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