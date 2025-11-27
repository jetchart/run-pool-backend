import { TripEntity } from '../../trip/entities/trip.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { RaceDistanceEntity } from './race-distance.entity';
import { RaceType } from '../enums/race-type.enum';

@Entity('race')
export class RaceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ name: 'image', type: 'bytea', nullable: true })
  image: Buffer;

  @Column({ name: 'image_thumbnail', type: 'bytea', nullable: true })
  imageThumbnail: Buffer;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50 })
  province: string;

  @Column({ length: 20 })
  country: string;

  @Column({ name: 'location', length: 100 })
  location: string;

  @Column({ name: 'website', length: 100 })
  website: string;

  @Column({
    type: 'enum',
    enum: RaceType,
    name: 'race_type',
  })
  raceType: RaceType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;

  @OneToMany(() => RaceDistanceEntity, (raceDistance) => raceDistance.race)
  distances: RaceDistanceEntity[];

  @OneToMany(() => TripEntity, (trip) => trip.race)
  trips: TripEntity[];
}
