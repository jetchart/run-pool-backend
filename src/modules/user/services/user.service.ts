import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserCredentialDto } from '../dtos/user-credential.dto';
import { UserDto } from '../dtos/user.dto';
import { UserProfileResponse } from '../dtos/user-profile-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: ['userProfile', 'userProfile.cars', 'userProfile.preferredRaceTypes', 'userProfile.preferredDistances']
    });
  }

  async findOne(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findUserWithProfile(userId: number): Promise<UserCredentialDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userProfile', 'userProfile.cars', 'userProfile.preferredRaceTypes', 'userProfile.preferredDistances']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Crear UserDto
    const userDto = new UserDto(
      user.id,
      user.email,
      user.name,
      user.givenName,
      user.familyName,
      user.pictureUrl
    );

    // Crear UserProfileResponse si existe
    let userProfileResponse: UserProfileResponse | undefined;
    if (user.userProfile) {
      userProfileResponse = {
        id: user.userProfile.id,
        name: user.userProfile.name,
        surname: user.userProfile.surname,
        email: user.userProfile.email,
        birthYear: user.userProfile.birthYear,
        gender: user.userProfile.gender,
        runningExperience: user.userProfile.runningExperience,
        usuallyTravelRace: user.userProfile.usuallyTravelRace,
        phoneCountryCode: user.userProfile.phoneCountryCode,
        phoneNumber: user.userProfile.phoneNumber,
        imageName: user.userProfile.imageName,
        user: {
          id: user.id,
          name: user.name,
          givenName: user.givenName,
          familyName: user.familyName,
          email: user.email,
          pictureUrl: user.pictureUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        cars: user.userProfile.cars?.map(car => ({
          id: car.id,
          brand: car.brand,
          model: car.model,
          year: car.year,
          color: car.color,
          seats: car.seats,
          licensePlate: car.licensePlate,
          createdAt: car.createdAt,
          updatedAt: car.updatedAt
        })) || [],
        preferredRaceTypes: user.userProfile.preferredRaceTypes?.map(prt => ({
          id: prt.id,
          raceType: prt.raceType
        })) || [],
        preferredDistances: user.userProfile.preferredDistances?.map(pd => ({
          id: pd.id,
          distance: pd.distance
        })) || [],
        createdAt: user.userProfile.createdAt,
        updatedAt: user.userProfile.updatedAt
      };
    }

    // Para este caso, como no tenemos un accessToken real, usamos un string vacío
    // En una implementación real, esto debería venir del token de autenticación
    return new UserCredentialDto(userDto, '', userProfileResponse);
  }
}
