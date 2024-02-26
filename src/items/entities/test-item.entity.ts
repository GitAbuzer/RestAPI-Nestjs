import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column } from 'typeorm';

@Entity()
export default class TestItem {

  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;
   
  @Column()
    description: string;


}
