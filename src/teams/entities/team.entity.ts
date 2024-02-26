import AppUser from "src/appUsers/entities/app-user.entity";
import { Task } from "src/tasks/entities/task.entity";
import { 
  Column,
  CreateDateColumn,
  Entity, 
  JoinTable, 
  ManyToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn} from "typeorm";

@Entity()
export class Team {
  
  @PrimaryGeneratedColumn()
    id: number
  
  @Column()
    name: string
    
  @Column()
    description: string

  @ManyToMany(() => Task)
  @JoinTable()
    tasks: Task[]

  @CreateDateColumn()
    createdDate: Date

  @UpdateDateColumn()
    updateDate: Date

  @Column( {
    default: true
  } )
    isActive: boolean
    
  @ManyToMany((type) => AppUser, (appUser) => appUser.teams, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
  })
  @JoinTable( {
    name: "team_members_app_user",
    joinColumn: { name: "teamId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "appUserId" }
  } )
  members: AppUser[]

}