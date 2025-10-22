import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { TripRatingType } from '../enums/trip-rating-type.enum';

@Entity('trip_rating')
@Unique(['trip', 'rater', 'rated'])
export class TripRatingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TripEntity, { nullable: false, onDelete: 'CASCADE' })
  trip: TripEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  rater: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  rated: UserEntity;

  @Column({ type: 'enum', enum: TripRatingType })
  type: TripRatingType;

  @Column({ type: 'int', width: 1 })
  rating: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
