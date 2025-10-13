import { CreateTripDto } from '../dtos/create-trip.dto';

export const mockCreateTripDto: CreateTripDto = {
  driverId: 1,
  raceId: 1,
  departureDay: '2025-10-15',
  departureHour: '08:30',
  departureCity: 'Buenos Aires',
  departureProvince: 'Buenos Aires',
  description: 'Viaje a la carrera de 10K en La Plata. Salgo temprano para evitar el tráfico.',
  seats: 3,
};