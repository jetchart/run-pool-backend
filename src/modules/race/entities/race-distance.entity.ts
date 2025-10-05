import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { RaceEntity } from './race.entity';
import { DistanceEntity } from './distance.entity';

@Entity('race_distance')
@Unique(['race', 'distance'])
export class RaceDistanceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => RaceEntity, (race) => race.distances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'race_id' })
  race: RaceEntity;

  @ManyToOne(() => DistanceEntity, (distance) => distance.races, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'distance_id' })
  distance: DistanceEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;
}
