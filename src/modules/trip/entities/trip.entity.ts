import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { RaceEntity } from '../../race/entities/race.entity';
import { CarEntity } from '../../user/entities/car.entity';
import { TripPassengerEntity } from './trip-passenger.entity';

@Entity('trip')
export class TripEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: UserEntity;

  @ManyToOne(() => RaceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'race_id' })
  race: RaceEntity;

  @ManyToOne(() => CarEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: CarEntity;

  @Column({
    name: 'departure_day',
    type: 'date',
  })
  departureDay: Date;

  @Column({
    name: 'departure_hour',
    type: 'time',
  })
  departureHour: string;

  @Column({
    name: 'departure_city',
    type: 'varchar',
    length: 100,
  })
  departureCity: string;

  @Column({
    name: 'departure_province',
    type: 'varchar',
    length: 100,
  })
  departureProvince: string;

  @Column({
    name: 'arrival_city',
    type: 'varchar',
    length: 100,
  })
  arrivalCity: string;

  @Column({
    name: 'arrival_province',
    type: 'varchar',
    length: 100,
  })
  arrivalProvince: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'int',
  })
  seats: number;

  @OneToMany(() => TripPassengerEntity, (tripPassenger) => tripPassenger.trip)
  passengers: TripPassengerEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;
}