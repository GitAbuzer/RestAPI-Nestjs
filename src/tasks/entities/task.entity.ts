import AppUser from "src/appUsers/entities/app-user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
    id: number
  
  @Column()
    title: string

  @Column()
    description: string

  @Column()
    isDone: boolean

  @Column( {
    default: true
  } )
    isActive: boolean
    
  @CreateDateColumn()
    createdDate: Date

  @UpdateDateColumn()
    updateDate: Date

  @Column()
    dueDate: Date

  @OneToOne(()  => AppUser)
    creator: AppUser

  @Column({type: "varchar", length: 4000})
    image: string

  @ManyToOne(() => AppUser, appUser => appUser.tasks)
    appUser: AppUser

}