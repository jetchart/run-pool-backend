import { UserEntity } from '../entities/user.entity';

export const mockUserEntity = (overrides?: Partial<UserEntity>): UserEntity => {
  const user = new UserEntity();
  user.id = 1;
  user.name = 'John Doe';
  user.givenName = 'John';
  user.familyName = 'Doe';
  user.email = 'john.doe@example.com';
  user.pictureUrl = 'https://example.com/picture.jpg';
  user.createdAt = new Date('2025-10-13T10:00:00Z');

  return Object.assign(user, overrides);
};