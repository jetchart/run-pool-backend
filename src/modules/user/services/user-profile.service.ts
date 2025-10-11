import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserProfileEntity } from '../entities/user-profile.entity';
import { CarEntity } from '../entities/car.entity';
import { UserProfileRaceTypeEntity } from '../entities/user-profile-race-type.entity';
import { UserProfileDistanceEntity } from '../entities/user-profile-distance.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateCompleteUserProfileDto } from '../dtos/create-complete-user-profile.dto';
import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { UserProfileResponse } from '../dtos/user-profile-response.dto';

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

  private toResponse(entity: UserProfileEntity): UserProfileResponse {
    return {
      id: entity.id,
      name: entity.name,
      surname: entity.surname,
      email: entity.email,
      birthYear: entity.birthYear,
      gender: entity.gender,
      runningExperience: entity.runningExperience,
      usuallyTravelRace: entity.usuallyTravelRace,
      imageName: entity.imageName,
      user: {
        id: entity.user.id,
        name: entity.user.name,
        givenName: entity.user.givenName,
        familyName: entity.user.familyName,
        email: entity.user.email,
        pictureUrl: entity.user.pictureUrl,
        createdAt: entity.user.createdAt,
        updatedAt: entity.user.updatedAt,
      },
      cars: entity.cars?.map(car => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        color: car.color,
        seats: car.seats,
        licensePlate: car.licensePlate,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
      })) || [],
      preferredRaceTypes: entity.preferredRaceTypes?.map(prt => ({
        id: prt.id,
        raceType: prt.raceType,
      })) || [],
      preferredDistances: entity.preferredDistances?.map(pd => ({
        id: pd.id,
        distance: pd.distance,
      })) || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async createCompleteProfile(dto: CreateCompleteUserProfileDto): Promise<UserProfileResponse> {
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
      const completeProfile = await manager.findOne(UserProfileEntity, {
        where: { id: savedProfile.id },
        relations: [
          'user',
          'cars',
          'preferredRaceTypes',
          'preferredDistances',
        ],
      }) as UserProfileEntity;

      return this.toResponse(completeProfile);
    });
  }

  async findCompleteProfile(userProfileId: number): Promise<UserProfileResponse> {
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

    return this.toResponse(profile);
  }

  async findProfileByUserId(userId: number): Promise<UserProfileResponse> {
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

    return this.toResponse(profile);
  }

  async updateProfile(userProfileId: number, dto: UpdateUserProfileDto): Promise<UserProfileResponse> {
    return await this.dataSource.transaction(async (manager) => {
      return this.updateProfileInternal(manager, userProfileId, dto);
    });
  }

  async updateProfileByUserId(userId: number, dto: UpdateUserProfileDto): Promise<UserProfileResponse> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Buscar el perfil por userId
      const existingProfile = await manager.findOne(UserProfileEntity, {
        where: { user: { id: userId } },
        relations: ['cars', 'preferredRaceTypes', 'preferredDistances'],
      });

      if (!existingProfile) {
        throw new NotFoundException(`User profile for user id ${userId} not found`);
      }

      // 2. Usar el método de actualización existente con el ID del perfil encontrado
      return this.updateProfileInternal(manager, existingProfile.id, dto);
    });
  }

  private async updateProfileInternal(manager: any, userProfileId: number, dto: UpdateUserProfileDto): Promise<UserProfileResponse> {
    // Reutilizar la lógica de actualización existente
    const existingProfile = await manager.findOne(UserProfileEntity, {
      where: { id: userProfileId },
      relations: ['cars', 'preferredRaceTypes', 'preferredDistances'],
    });

    if (!existingProfile) {
      throw new NotFoundException(`User profile with id ${userProfileId} not found`);
    }

    // Actualizar campos básicos del perfil si están presentes
    if (dto.name !== undefined) existingProfile.name = dto.name;
    if (dto.surname !== undefined) existingProfile.surname = dto.surname;
    if (dto.email !== undefined) existingProfile.email = dto.email;
    if (dto.birthYear !== undefined) existingProfile.birthYear = dto.birthYear;
    if (dto.gender !== undefined) existingProfile.gender = dto.gender;
    if (dto.runningExperience !== undefined) existingProfile.runningExperience = dto.runningExperience;
    if (dto.usuallyTravelRace !== undefined) existingProfile.usuallyTravelRace = dto.usuallyTravelRace;
    if (dto.imageName !== undefined) existingProfile.imageName = dto.imageName;

    await manager.save(UserProfileEntity, existingProfile);

    // Actualizar coches si están presentes
    if (dto.cars) {
      // Eliminar coches existentes
      await manager.delete(CarEntity, { userProfile: { id: userProfileId } });

      // Verificar que las matrículas no estén duplicadas
      const licensePlates = dto.cars
        .filter(car => car.licensePlate)
        .map(car => car.licensePlate!);
      
      if (licensePlates.length > 0) {
        const existingCars = await manager.find(CarEntity, {
          where: licensePlates.map(plate => ({ licensePlate: plate })),
        });

        if (existingCars.length > 0) {
          const duplicatePlates = existingCars.map(car => car.licensePlate);
          throw new BadRequestException(`License plates already exist: ${duplicatePlates.join(', ')}`);
        }
      }

      // Crear nuevos coches
      if (dto.cars.length > 0) {
        const newCars = dto.cars.map(carDto =>
          manager.create(CarEntity, {
            brand: carDto.brand!,
            model: carDto.model!,
            year: carDto.year!,
            color: carDto.color!,
            seats: carDto.seats!,
            licensePlate: carDto.licensePlate!,
            userProfile: existingProfile,
          })
        );
        await manager.save(CarEntity, newCars);
      }
    }

    // Actualizar tipos de carrera preferidos si están presentes
    if (dto.preferredRaceTypes) {
      const existingRaceTypes = await manager.find(UserProfileRaceTypeEntity, {
        where: { userProfile: { id: userProfileId } },
      });

      const newRaceTypes = dto.preferredRaceTypes.map(rt => rt.raceType);
      const existingRaceTypeValues = existingRaceTypes.map(rt => rt.raceType);

      // Eliminar tipos de carrera que ya no están en la nueva lista
      const raceTypesToDelete = existingRaceTypes.filter(existing => 
        !newRaceTypes.includes(existing.raceType)
      );
      if (raceTypesToDelete.length > 0) {
        await manager.delete(UserProfileRaceTypeEntity, 
          raceTypesToDelete.map(rt => rt.id)
        );
      }

      // Agregar nuevos tipos de carrera que no existían antes
      const raceTypesToAdd = newRaceTypes.filter(newRaceType => 
        !existingRaceTypeValues.includes(newRaceType)
      );
      if (raceTypesToAdd.length > 0) {
        const newRaceTypeEntities = raceTypesToAdd.map(raceType =>
          manager.create(UserProfileRaceTypeEntity, {
            userProfile: existingProfile,
            raceType: raceType,
          })
        );
        await manager.save(UserProfileRaceTypeEntity, newRaceTypeEntities);
      }
    }

    // Actualizar distancias preferidas si están presentes
    if (dto.preferredDistances) {
      const existingDistances = await manager.find(UserProfileDistanceEntity, {
        where: { userProfile: { id: userProfileId } },
      });

      const newDistances = dto.preferredDistances.map(d => d.distance);
      const existingDistanceValues = existingDistances.map(d => d.distance);

      // Eliminar distancias que ya no están en la nueva lista
      const distancesToDelete = existingDistances.filter(existing => 
        !newDistances.includes(existing.distance)
      );
      if (distancesToDelete.length > 0) {
        await manager.delete(UserProfileDistanceEntity, 
          distancesToDelete.map(d => d.id)
        );
      }

      // Agregar nuevas distancias que no existían antes
      const distancesToAdd = newDistances.filter(newDistance => 
        !existingDistanceValues.includes(newDistance)
      );
      if (distancesToAdd.length > 0) {
        const newDistanceEntities = distancesToAdd.map(distance =>
          manager.create(UserProfileDistanceEntity, {
            userProfile: existingProfile,
            distance: distance,
          })
        );
        await manager.save(UserProfileDistanceEntity, newDistanceEntities);
      }
    }

    // Retornar el perfil actualizado con todas las relaciones
    const updatedProfile = await manager.findOne(UserProfileEntity, {
      where: { id: userProfileId },
      relations: [
        'user',
        'cars',
        'preferredRaceTypes',
        'preferredDistances',
      ],
    }) as UserProfileEntity;

    return this.toResponse(updatedProfile);
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