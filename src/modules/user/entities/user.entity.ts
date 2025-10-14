import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'given_name', type: 'varchar', length: 255 })
  givenName: string;

  @Column({ name: 'family_name', type: 'varchar', length: 255, nullable: true })
  familyName: string;

  @Column({ name: 'picture_url', type: 'varchar', length: 255 })
  pictureUrl: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @OneToOne(() => UserProfileEntity, (userProfile) => userProfile.user)
  userProfile?: UserProfileEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
