import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  Index, 
  JoinColumn, 
  JoinTable, 
  ManyToMany, 
  OneToMany, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn} from "typeorm";
import { Role } from "./role.entity";
import { Address } from "../../addresses/entities/address.entity";
import { ContactInfo } from "./contact-info.entity";
import { Team } from "../../teams/entities/team.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Profile } from "../../profiles/entities/profile.entity";
import { Exclude } from "class-transformer";

@Entity()
export default class AppUser {

  constructor(partial: Partial<AppUser>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Index({ unique: true })
    id: number
  
  @Column()
    firstName: string
  
  @Column()
    lastName: string
    
  @Exclude()
  @Column()
    password: string
  
  @Column()
  @Index({ unique: true })
    username: string
  
  @OneToOne(() => Profile, (profile) => profile.appUser) // specify inverse side as a second parameter
  @JoinColumn()
    profile: Profile

  @Column( {
    default: true
  } )
    isActive: boolean

  @CreateDateColumn()
    createdDate: Date

  @UpdateDateColumn()
    updateDate: Date

  @OneToMany(() =>  Role, role => role.appUser, {
    cascade: true,
    eager: true,
    createForeignKeyConstraints: true
  })
    roles: Role[]
  
  @OneToMany(() => ContactInfo, contactInfo => contactInfo.appUser, {
    cascade: true,
    eager: true,
    createForeignKeyConstraints: true
  })
    contactInfos: ContactInfo[]

  @OneToMany((type) => Address, (address) => address.appUser, {
    cascade: true,
    eager: true,
  })
  addresses: Address[]

  @OneToMany((type) => Task, tasks => tasks.appUser)
    tasks: Task[]

  @ManyToMany((type) => Team, (team) => team.members)
    teams: Team[]
}