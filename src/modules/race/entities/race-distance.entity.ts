import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { RaceEntity } from './race.entity';
import { Distance } from '../enums/distance.enum';

@Entity('race_distance')
@Unique(['race', 'distance'])
export class RaceDistanceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => RaceEntity, (race) => race.distances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'race_id' })
  race: RaceEntity;

  @Column({ name: 'distance', type: 'int' })
  distance: Distance;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;
}
