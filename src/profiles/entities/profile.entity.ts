import AppUser from 'src/appUsers/entities/app-user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column('varchar', {
    default: 'https://static.thenounproject.com/png/5034901-200.png',
  })
  photo: string;

  @OneToOne(() => AppUser, (appUser) => appUser.profile) // specify inverse side as a second parameter
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
