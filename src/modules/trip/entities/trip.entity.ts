import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { RaceEntity } from '../../race/entities/race.entity';

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
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'int',
  })
  seats: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;
}