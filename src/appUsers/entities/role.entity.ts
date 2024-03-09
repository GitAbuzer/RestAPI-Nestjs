import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import AppUser from './app-user.entity';

export enum RoleType {
  Admin = 'admin',
  Manager = 'manager',
  Engineer = 'engineer',
  Formen = 'formen',
  Worker = 'worker',
  User = 'user',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.User,
  })
  type: RoleType;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column()
  description: string;

  @ManyToOne(() => AppUser, (appUser) => appUser.roles)
  appUser: AppUser;
}
