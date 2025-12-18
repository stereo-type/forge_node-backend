import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Workflow } from '../../workflows/entities/workflow.entity';
import { ExecutionLog } from './execution-log.entity';

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
}

@Entity('executions')
@Index(['workflowId', 'status'])
@Index(['userId', 'status'])
export class Execution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workflowId: string;

  @ManyToOne(() => Workflow, (workflow) => workflow.executions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workflowId' })
  workflow: Workflow;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.executions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: ExecutionStatus, default: ExecutionStatus.PENDING })
  status: ExecutionStatus;

  @Column({ type: 'jsonb', nullable: true })
  inputData: Record<string, unknown>; // Входные данные для выполнения

  @Column({ type: 'jsonb', nullable: true })
  outputData: Record<string, unknown>; // Результат выполнения

  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, unknown>; // Контекст выполнения (промежуточные данные)

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date;

  @Column({ type: 'int', default: 0 })
  duration: number; // Длительность в миллисекундах

  @Column({ type: 'text', nullable: true })
  error: string; // Сообщение об ошибке, если выполнение провалилось

  @OneToMany(() => ExecutionLog, (log) => log.execution, { cascade: true })
  logs: ExecutionLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
