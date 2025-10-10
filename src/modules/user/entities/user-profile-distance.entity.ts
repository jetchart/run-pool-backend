import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { DistanceEntity } from '../../race/entities/distance.entity';

@Entity('user_profile_distance')
export class UserProfileDistanceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.preferredDistances, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfileEntity;

  @ManyToOne(() => DistanceEntity, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'distance_id' })
  distance: DistanceEntity;
}