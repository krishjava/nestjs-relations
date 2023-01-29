import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
} from 'typeorm';
import { Demo1 } from './demo1.entity';

@Entity({ name: 'demo' })
export class Demo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  createAt: Date;

  @ManyToMany(() => Demo1, (demo1) => demo1.demos)
  @JoinTable({ name: 'demo_with_demo1' })
  demos1: Demo1[];
}
