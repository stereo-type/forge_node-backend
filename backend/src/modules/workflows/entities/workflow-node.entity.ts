import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Workflow } from './workflow.entity';

export enum NodeType {
  TRIGGER = 'trigger',
  ACTION = 'action',
  CONDITION = 'condition',
  TRANSFORM = 'transform',
  WEBHOOK = 'webhook',
  HTTP = 'http',
  DATABASE = 'database',
  EMAIL = 'email',
  SCHEDULE = 'schedule',
  MANUAL = 'manual',
}

@Entity('workflow_nodes')
@Index(['workflowId', 'position'])
export class WorkflowNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workflowId: string;

  @ManyToOne(() => Workflow, (workflow) => workflow.nodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workflowId' })
  workflow: Workflow;

  @Column()
  type: string; // Тип ноды (например, 'webhook', 'http', 'condition')

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'jsonb', default: {} })
  position: { x: number; y: number };

  @Column({ type: 'jsonb', default: {} })
  data: Record<string, unknown>; // Конфигурация ноды

  @Column({ type: 'jsonb', default: [] })
  inputs: Array<{
    name: string;
    type: string;
    required?: boolean;
    defaultValue?: unknown;
  }>;

  @Column({ type: 'jsonb', default: [] })
  outputs: Array<{
    name: string;
    type: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
