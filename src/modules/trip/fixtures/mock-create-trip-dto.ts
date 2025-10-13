import { CreateTripDto } from '../dtos/create-trip.dto';

export const mockCreateTripDto = (overrides?: Partial<CreateTripDto>): CreateTripDto => ({
  driverId: 1,
  raceId: 1,
  departureDay: '2026-12-25', // Future date to avoid past date errors
  departureHour: '08:30',
  departureCity: 'Buenos Aires',
  departureProvince: 'Buenos Aires',
  arrivalCity: 'La Plata',
  arrivalProvince: 'Buenos Aires',
  description: 'Viaje a la carrera de 10K en La Plata. Salgo temprano para evitar el tráfico.',
  seats: 3,
  ...overrides,
});