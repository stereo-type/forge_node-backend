import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Execution, ExecutionStatus } from './entities/execution.entity';
import { ExecutionLog, LogLevel } from './entities/execution-log.entity';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { UpdateExecutionDto } from './dto/update-execution.dto';
import { WorkflowsService } from '../workflows/workflows.service';

@Injectable()
export class ExecutionsService {
  constructor(
    @InjectRepository(Execution)
    private executionsRepository: Repository<Execution>,
    @InjectRepository(ExecutionLog)
    private logsRepository: Repository<ExecutionLog>,
    private workflowsService: WorkflowsService,
  ) {}

  async create(userId: string, createExecutionDto: CreateExecutionDto) {
    // Проверяем, что workflow существует и принадлежит пользователю
    const workflow = await this.workflowsService.findOne(createExecutionDto.workflowId, userId);

    if (workflow.status !== 'active') {
      throw new BadRequestException('Cannot execute workflow that is not active');
    }

    const execution = this.executionsRepository.create({
      workflowId: createExecutionDto.workflowId,
      userId,
      inputData: createExecutionDto.inputData || {},
      status: ExecutionStatus.PENDING,
      context: {},
    });

    const savedExecution = await this.executionsRepository.save(execution);

    // Добавляем начальный лог
    await this.addLog(savedExecution.id, LogLevel.INFO, 'Execution created', {
      workflowId: workflow.id,
      workflowName: workflow.name,
    });

    // TODO: Здесь будет запуск выполнения через BullMQ
    // Пока просто переводим в статус RUNNING
    savedExecution.status = ExecutionStatus.RUNNING;
    savedExecution.startedAt = new Date();
    await this.executionsRepository.save(savedExecution);

    return this.findOne(savedExecution.id, userId);
  }

  async findAll(userId: string, workflowId?: string) {
    const where: { userId: string; workflowId?: string } = { userId };
    if (workflowId) {
      where.workflowId = workflowId;
    }

    return this.executionsRepository.find({
      where,
      relations: ['workflow'],
      order: { createdAt: 'DESC' },
      take: 100, // Ограничиваем последними 100 выполнениями
    });
  }

  async findOne(id: string, userId: string) {
    const execution = await this.executionsRepository.findOne({
      where: { id },
      relations: ['workflow', 'logs'],
      order: { logs: { createdAt: 'ASC' } },
    });

    if (!execution) {
      throw new NotFoundException(`Execution with ID ${id} not found`);
    }

    if (execution.userId !== userId) {
      throw new ForbiddenException('You do not have access to this execution');
    }

    return execution;
  }

  async update(id: string, userId: string, updateExecutionDto: UpdateExecutionDto) {
    const execution = await this.findOne(id, userId);

    Object.assign(execution, updateExecutionDto);

    // Если статус меняется на SUCCESS или FAILED, обновляем finishedAt
    if (
      updateExecutionDto.status === ExecutionStatus.SUCCESS ||
      updateExecutionDto.status === ExecutionStatus.FAILED ||
      updateExecutionDto.status === ExecutionStatus.CANCELLED
    ) {
      execution.finishedAt = new Date();
      if (execution.startedAt) {
        execution.duration = execution.finishedAt.getTime() - execution.startedAt.getTime();
      }
    }

    return this.executionsRepository.save(execution);
  }

  async cancel(id: string, userId: string) {
    const execution = await this.findOne(id, userId);

    if (
      execution.status === ExecutionStatus.SUCCESS ||
      execution.status === ExecutionStatus.FAILED ||
      execution.status === ExecutionStatus.CANCELLED
    ) {
      throw new BadRequestException('Cannot cancel completed execution');
    }

    execution.status = ExecutionStatus.CANCELLED;
    execution.finishedAt = new Date();
    if (execution.startedAt) {
      execution.duration = execution.finishedAt.getTime() - execution.startedAt.getTime();
    }

    await this.addLog(execution.id, LogLevel.WARN, 'Execution cancelled');

    return this.executionsRepository.save(execution);
  }

  async addLog(
    executionId: string,
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
  ) {
    const log = this.logsRepository.create({
      executionId,
      level,
      message,
      data: data || {},
    });
    return this.logsRepository.save(log);
  }

  async remove(id: string, userId: string) {
    const execution = await this.findOne(id, userId);
    await this.executionsRepository.remove(execution);
    return { message: 'Execution deleted successfully' };
  }
}
