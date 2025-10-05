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

@Entity('distance')
export class DistanceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'short_description', length: 50 })
  shortDescription: string;

  @Column()
  kilometers: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;

  @OneToMany(() => RaceDistanceEntity, (raceDistance) => raceDistance.distance)
  races: RaceDistanceEntity[];
}
