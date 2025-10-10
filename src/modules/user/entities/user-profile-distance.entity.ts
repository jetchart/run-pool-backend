import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { Distance } from '../enums/distance.enum';

@Entity('user_profile_distance')
export class UserProfileDistanceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.preferredDistances, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfileEntity;

  @Column({
    type: 'enum',
    enum: Distance,
  })
  distance: Distance;
}