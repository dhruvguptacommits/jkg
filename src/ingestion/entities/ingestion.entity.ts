import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ingestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string; // 'pending', 'running', 'completed', 'failed'

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}
