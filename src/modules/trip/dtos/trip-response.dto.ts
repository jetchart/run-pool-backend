export class TripResponse {
  id: number;
  driver: {
    id: number;
    name: string;
    givenName: string;
    familyName: string;
    email: string;
    pictureUrl: string;
  };
  race: {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    price: number;
  };
  departureDay: Date;
  departureHour: string;
  departureCity: string;
  departureProvince: string;
  description?: string;
  seats: number;
  passengers: {
    id: number;
    passenger: {
      id: number;
      name: string;
      givenName: string;
      familyName: string;
      email: string;
      pictureUrl: string;
    };
  }[];
  createdAt: Date;
  deletedAt?: Date;
}