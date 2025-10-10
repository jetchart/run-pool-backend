import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { RaceType } from '../../race/enums/race-type.enum';

@Entity('user_profile_race_type')
export class UserProfileRaceTypeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.preferredRaceTypes, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfileEntity;

  @Column({
    name: 'race_type',
    type: 'enum',
    enum: RaceType,
  })
  raceType: RaceType;
}