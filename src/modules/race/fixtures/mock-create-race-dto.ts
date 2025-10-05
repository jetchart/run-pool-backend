import { CreateRaceDto } from '../dtos/create-race.dto';

export const mockCreateRaceDto: CreateRaceDto = {
  name: 'Test Marathon',
  description: 'A test marathon for testing purposes',
  startDate: '2024-06-15',
  endDate: '2024-06-15',
  imageUrl: 'https://example.com/marathon.jpg',
  city: 'Test City',
  province: 'Test Province',
  country: 'Test Country',
  location: 'Test Location',
  website: 'https://testmarathon.com',
  startLocation: 'Starting Point',
  raceDistances: [{ distanceId: 1 }],
};