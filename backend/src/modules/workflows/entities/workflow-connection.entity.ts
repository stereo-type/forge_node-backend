import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Workflow } from './workflow.entity';
import { WorkflowNode } from './workflow-node.entity';

@Entity('workflow_connections')
@Index(['workflowId'])
export class WorkflowConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workflowId: string;

  @ManyToOne(() => Workflow, (workflow) => workflow.connections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workflowId' })
  workflow: Workflow;

  @Column()
  sourceNodeId: string;

  @ManyToOne(() => WorkflowNode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sourceNodeId' })
  sourceNode: WorkflowNode;

  @Column()
  targetNodeId: string;

  @ManyToOne(() => WorkflowNode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetNodeId' })
  targetNode: WorkflowNode;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sourceOutput: string; // Имя выходного порта источника

  @Column({ type: 'varchar', length: 100, nullable: true })
  targetInput: string; // Имя входного порта цели

  @Column({ type: 'jsonb', default: {} })
  data: Record<string, unknown>; // Дополнительные данные связи

  @CreateDateColumn()
  createdAt: Date;
}
