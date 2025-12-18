import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { WorkflowNode } from './workflow-node.entity';
import { WorkflowConnection } from './workflow-connection.entity';
import { Execution } from '../../executions/entities/execution.entity';

export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, unknown>;

  @Column({ type: 'enum', enum: WorkflowStatus, default: WorkflowStatus.DRAFT })
  status: WorkflowStatus;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.workflows, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => WorkflowNode, (node) => node.workflow, { cascade: true })
  nodes: WorkflowNode[];

  @OneToMany(() => WorkflowConnection, (connection) => connection.workflow, {
    cascade: true,
  })
  connections: WorkflowConnection[];

  @OneToMany(() => Execution, (execution) => execution.workflow)
  executions: Execution[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
