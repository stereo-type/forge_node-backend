import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Execution } from './execution.entity';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

@Entity('execution_logs')
@Index(['executionId', 'createdAt'])
export class ExecutionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  executionId: string;

  @ManyToOne(() => Execution, (execution) => execution.logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'executionId' })
  execution: Execution;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nodeId: string; // ID ноды, которая сгенерировала лог

  @Column({ type: 'enum', enum: LogLevel, default: LogLevel.INFO })
  level: LogLevel;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, unknown>; // Дополнительные данные лога

  @CreateDateColumn()
  createdAt: Date;
}
