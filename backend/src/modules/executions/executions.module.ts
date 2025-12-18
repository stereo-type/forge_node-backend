import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutionsService } from './executions.service';
import { ExecutionsController } from './executions.controller';
import { Execution } from './entities/execution.entity';
import { ExecutionLog } from './entities/execution-log.entity';
import { WorkflowsModule } from '../workflows/workflows.module';

@Module({
  imports: [TypeOrmModule.forFeature([Execution, ExecutionLog]), WorkflowsModule],
  controllers: [ExecutionsController],
  providers: [ExecutionsService],
  exports: [ExecutionsService],
})
export class ExecutionsModule {}
