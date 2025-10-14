import { TripEntity } from '../entities/trip.entity';
import { mockRace } from '../../race/fixtures/mock-race';
import { CarEntity } from '../../user/entities/car.entity';

const mockCar: CarEntity = {
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
};

export const mockTrip: TripEntity = {
  id: 1,
  driver: {
    id: 1,
    name: 'Juan Conductor',
    givenName: 'Juan',
    familyName: 'Conductor',
    email: 'juan@example.com',
    pictureUrl: 'http://example.com/juan.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  race: mockRace,
  car: mockCar,
  departureDay: new Date('2025-10-15'),
  departureHour: '08:30',
  departureCity: 'Buenos Aires',
  departureProvince: 'Buenos Aires',
  arrivalCity: 'La Plata',
  arrivalProvince: 'Buenos Aires',
  description: 'Viaje a la carrera de 10K en La Plata. Salgo temprano para evitar el tráfico.',
  seats: 3,
  passengers: [],
  createdAt: new Date(),
  deletedAt: undefined,
} as TripEntity;