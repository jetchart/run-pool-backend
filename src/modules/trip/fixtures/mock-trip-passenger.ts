import { TripPassengerEntity } from '../entities/trip-passenger.entity';
import { mockTripEntity } from './mock-trip-entity';
import { mockUserEntity } from '../../user/fixtures/mock-user-entity';

export const mockTripPassenger = (overrides?: Partial<TripPassengerEntity>): TripPassengerEntity => {
  const tripPassenger = new TripPassengerEntity();
  tripPassenger.id = 1;
  tripPassenger.trip = mockTripEntity();
  tripPassenger.passenger = mockUserEntity({ id: 2, name: 'María Pasajera', givenName: 'María', familyName: 'Pasajera', email: 'maria@example.com' });
  tripPassenger.createdAt = new Date('2025-10-13T10:30:00Z');
  tripPassenger.updatedAt = new Date('2025-10-13T10:30:00Z');
  tripPassenger.deletedAt = undefined;

  return Object.assign(tripPassenger, overrides);
};

// Alias para mantener compatibilidad con tests existentes
export const mockTripPassengerEntity = mockTripPassenger;