import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from './entities/workflow.entity';
import { WorkflowNode } from './entities/workflow-node.entity';
import { WorkflowConnection } from './entities/workflow-connection.entity';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private workflowsRepository: Repository<Workflow>,
    @InjectRepository(WorkflowNode)
    private nodesRepository: Repository<WorkflowNode>,
    @InjectRepository(WorkflowConnection)
    private connectionsRepository: Repository<WorkflowConnection>,
  ) {}

  async create(userId: string, createWorkflowDto: CreateWorkflowDto) {
    const workflow = this.workflowsRepository.create({
      ...createWorkflowDto,
      userId,
    });

    const savedWorkflow = await this.workflowsRepository.save(workflow);

    // Сохраняем ноды
    if (createWorkflowDto.nodes && createWorkflowDto.nodes.length > 0) {
      const nodes = createWorkflowDto.nodes.map((nodeDto) =>
        this.nodesRepository.create({
          ...nodeDto,
          workflowId: savedWorkflow.id,
        }),
      );
      await this.nodesRepository.save(nodes);
    }

    // Сохраняем связи
    if (createWorkflowDto.connections && createWorkflowDto.connections.length > 0) {
      const connections = createWorkflowDto.connections.map((connDto) =>
        this.connectionsRepository.create({
          ...connDto,
          workflowId: savedWorkflow.id,
        }),
      );
      await this.connectionsRepository.save(connections);
    }

    return this.findOne(savedWorkflow.id, userId);
  }

  async findAll(userId: string) {
    return this.workflowsRepository.find({
      where: { userId },
      relations: ['nodes', 'connections'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const workflow = await this.workflowsRepository.findOne({
      where: { id },
      relations: ['nodes', 'connections', 'nodes.sourceNode', 'nodes.targetNode'],
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    if (workflow.userId !== userId) {
      throw new ForbiddenException('You do not have access to this workflow');
    }

    return workflow;
  }

  async update(id: string, userId: string, updateWorkflowDto: UpdateWorkflowDto) {
    const workflow = await this.findOne(id, userId);

    // Обновляем основные поля
    Object.assign(workflow, {
      name: updateWorkflowDto.name ?? workflow.name,
      description: updateWorkflowDto.description ?? workflow.description,
      settings: updateWorkflowDto.settings ?? workflow.settings,
      status: updateWorkflowDto.status ?? workflow.status,
    });

    // Обновляем ноды, если они переданы
    if (updateWorkflowDto.nodes !== undefined) {
      // Удаляем старые ноды
      await this.nodesRepository.delete({ workflowId: id });

      // Создаем новые ноды
      if (updateWorkflowDto.nodes.length > 0) {
        const nodes = updateWorkflowDto.nodes.map((nodeDto) =>
          this.nodesRepository.create({
            ...nodeDto,
            workflowId: id,
          }),
        );
        await this.nodesRepository.save(nodes);
      }
    }

    // Обновляем связи, если они переданы
    if (updateWorkflowDto.connections !== undefined) {
      // Удаляем старые связи
      await this.connectionsRepository.delete({ workflowId: id });

      // Создаем новые связи
      if (updateWorkflowDto.connections.length > 0) {
        const connections = updateWorkflowDto.connections.map((connDto) =>
          this.connectionsRepository.create({
            ...connDto,
            workflowId: id,
          }),
        );
        await this.connectionsRepository.save(connections);
      }
    }

    await this.workflowsRepository.save(workflow);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    const workflow = await this.findOne(id, userId);
    await this.workflowsRepository.remove(workflow);
    return { message: 'Workflow deleted successfully' };
  }
}
