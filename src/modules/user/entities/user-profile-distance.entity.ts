import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';

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
    name: 'distance',
    type: 'int'
  })
  distance: number;
}