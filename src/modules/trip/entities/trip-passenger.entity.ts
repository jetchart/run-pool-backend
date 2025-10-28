import { TripPassengerStatus } from '../enums/trip-passenger-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Column,
} from 'typeorm';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('trip_passenger')
@Index(['trip', 'passenger'])
export class TripPassengerEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => TripEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: TripEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'passenger_id' })
  passenger: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;

  @Column({
    type: 'enum',
    enum: TripPassengerStatus,
    default: TripPassengerStatus.PENDING,
  })
  status: TripPassengerStatus;
}