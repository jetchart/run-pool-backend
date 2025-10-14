import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';

@Entity('car')
export class CarEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50 })
  brand: string;

  @Column({ length: 50 })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ length: 30 })
  color: string;

  @Column({ type: 'int' })
  seats: number;

  @Column({ name: 'license_plate', length: 20 })
  licensePlate: string;

  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.cars, { 
    nullable: false,
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfileEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;
}