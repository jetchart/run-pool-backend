import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { CarEntity } from '../entities/car.entity';
import { UserProfileRaceTypeEntity } from '../entities/user-profile-race-type.entity';
import { UserProfileDistanceEntity } from '../entities/user-profile-distance.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateCompleteUserProfileDto } from '../dtos/create-complete-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
    @InjectRepository(UserProfileRaceTypeEntity)
    private readonly userProfileRaceTypeRepository: Repository<UserProfileRaceTypeEntity>,
    @InjectRepository(UserProfileDistanceEntity)
    private readonly userProfileDistanceRepository: Repository<UserProfileDistanceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createCompleteProfile(dto: CreateCompleteUserProfileDto): Promise<UserProfileEntity> {
    // Usar transacción para asegurar consistencia
    return await this.dataSource.transaction(async (manager) => {
      // 1. Verificar que el usuario existe
      const user = await manager.findOne(UserEntity, {
        where: { id: dto.userId },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${dto.userId} not found`);
      }

      // 2. Verificar que el usuario no tenga ya un perfil
      const existingProfile = await manager.findOne(UserProfileEntity, {
        where: { user: { id: dto.userId } },
      });

      if (existingProfile) {
        throw new BadRequestException(`User with id ${dto.userId} already has a profile`);
      }

      // 3. Crear el perfil principal
      const userProfile = manager.create(UserProfileEntity, {
        user: user,
        name: dto.name,
        surname: dto.surname,
        email: dto.email,
        birthYear: dto.birthYear,
        gender: dto.gender,
        runningExperience: dto.runningExperience,
        usuallyTravelRace: dto.usuallyTravelRace,
        imageName: dto.imageName,
      });

      const savedProfile = await manager.save(UserProfileEntity, userProfile);

      // 4. Crear los coches si existen
      if (dto.cars && dto.cars.length > 0) {
        // Verificar que las matrículas no estén duplicadas
        const licensePlates = dto.cars.map(car => car.licensePlate);
        const existingCars = await manager.find(CarEntity, {
          where: licensePlates.map(plate => ({ licensePlate: plate })),
        });

        if (existingCars.length > 0) {
          const duplicatePlates = existingCars.map(car => car.licensePlate);
          throw new BadRequestException(`License plates already exist: ${duplicatePlates.join(', ')}`);
        }

        const cars = dto.cars.map(carDto => 
          manager.create(CarEntity, {
            ...carDto,
            userProfile: savedProfile,
          })
        );

        await manager.save(CarEntity, cars);
      }

      // 5. Crear las preferencias de tipos de carrera si existen
      if (dto.preferredRaceTypes && dto.preferredRaceTypes.length > 0) {
        const raceTypePreferences = dto.preferredRaceTypes.map(raceTypeDto =>
          manager.create(UserProfileRaceTypeEntity, {
            userProfile: savedProfile,
            raceType: raceTypeDto.raceType,
          })
        );

        await manager.save(UserProfileRaceTypeEntity, raceTypePreferences);
      }

      // 6. Crear las preferencias de distancias si existen
      if (dto.preferredDistances && dto.preferredDistances.length > 0) {
        const distancePreferences = dto.preferredDistances.map(distanceDto =>
          manager.create(UserProfileDistanceEntity, {
            userProfile: savedProfile,
            distance: distanceDto.distance,
          })
        );

        await manager.save(UserProfileDistanceEntity, distancePreferences);
      }

      // 7. Retornar el perfil completo con todas las relaciones
      return await manager.findOne(UserProfileEntity, {
        where: { id: savedProfile.id },
        relations: [
          'user',
          'cars',
          'preferredRaceTypes',
          'preferredDistances',
        ],
      }) as UserProfileEntity;
    });
  }

  async findCompleteProfile(userProfileId: number): Promise<UserProfileEntity> {
    const profile = await this.userProfileRepository.findOne({
      where: { id: userProfileId },
      relations: [
        'user',
        'cars',
        'preferredRaceTypes',
        'preferredDistances',
      ],
    });

    if (!profile) {
      throw new NotFoundException(`User profile with id ${userProfileId} not found`);
    }

    return profile;
  }

  async findProfileByUserId(userId: number): Promise<UserProfileEntity> {
    const profile = await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: [
        'user',
        'cars',
        'preferredRaceTypes',
        'preferredDistances',
      ],
    });

    if (!profile) {
      throw new NotFoundException(`User profile for user id ${userId} not found`);
    }

    return profile;
  }

  async deleteProfile(userProfileId: number): Promise<void> {
    const profile = await this.userProfileRepository.findOne({
      where: { id: userProfileId },
    });

    if (!profile) {
      throw new NotFoundException(`User profile with id ${userProfileId} not found`);
    }

    // Soft delete - las relaciones se eliminarán en cascada
    await this.userProfileRepository.softDelete(userProfileId);
  }
}