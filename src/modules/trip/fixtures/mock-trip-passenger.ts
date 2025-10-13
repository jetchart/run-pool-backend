import { TripPassengerEntity } from '../entities/trip-passenger.entity';
import { mockTrip } from './mock-trip';

export const mockTripPassenger: TripPassengerEntity = {
  id: 1,
  trip: mockTrip,
  passenger: {
    id: 2,
    name: 'María Pasajera',
    givenName: 'María',
    familyName: 'Pasajera',
    email: 'maria@example.com',
    pictureUrl: 'http://example.com/maria.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
} as TripPassengerEntity;