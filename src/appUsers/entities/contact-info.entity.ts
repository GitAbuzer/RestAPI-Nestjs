import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import AppUser from './app-user.entity';

@Entity()
export class ContactInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  isPrimary: boolean;

  @Column()
  title: string;

  @Column()
  @Index({ unique: true })
  info: string;

  @ManyToOne(() => AppUser, (appUser) => appUser.contactInfos)
  appUser: AppUser;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
