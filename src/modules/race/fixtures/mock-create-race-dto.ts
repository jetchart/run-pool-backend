import { CreateRaceDto } from '../dtos/create-race.dto';
import { RaceType } from '../enums/race-type.enum';

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
  raceType: RaceType.STREET,
  raceDistances: [{ distanceId: 1 }],
};