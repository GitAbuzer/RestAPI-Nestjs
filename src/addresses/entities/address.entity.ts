import AppUser from 'src/appUsers/entities/app-user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  addressOne: string;

  @Column()
  addressTwo: string;

  @Column()
  country: string;

  @Column()
  county: string;

  @Column()
  city: string;

  @Column()
  zipCode: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @ManyToOne(() => AppUser, (appUser) => appUser.addresses, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  appUser: AppUser;
}
