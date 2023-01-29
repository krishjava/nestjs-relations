import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Demo } from './Demo';

@Entity({ name: 'demo1' })
export class Demo1 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  createAt: Date;

  @ManyToMany(() => Demo, (demo) => demo.demos1)
  @JoinTable({ name: 'demo1_with_demo' })
  demos: Demo[];
}
