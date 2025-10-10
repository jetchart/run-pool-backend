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
import { UserEntity } from '../../user/entities/user.entity';
import { Gender } from '../enums/gender.enum';
import { RunningExperience } from '../enums/running-experience.enum';
import { UsuallyTravelRace } from '../enums/usually-travel-race.enum';

@Entity('user_profile')
export class UserProfileEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  surname: string;

  @Column({ length: 255 })
  email: string;

  @Column({ name: 'birth_year', type: 'int' })
  birthYear: number;

  @Column({
    type: 'int',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    name: 'running_experience',
    type: 'int',
    enum: RunningExperience,
  })
  runningExperience: RunningExperience;

  @Column({
    name: 'image_file',
    type: 'bytea',
    nullable: true,
  })
  imageFile?: Buffer;

  @Column({
    name: 'image_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imageName?: string;

  @Column({
    name: 'usually_travel_race',
    type: 'int',
    enum: UsuallyTravelRace,
  })
  usuallyTravelRace: UsuallyTravelRace;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;
}