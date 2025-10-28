export class TripPassengerResponse {
  id: number;
  passenger: {
    id: number;
    name: string;
    givenName: string;
    familyName: string;
    email: string;
    pictureUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  status: string;
}