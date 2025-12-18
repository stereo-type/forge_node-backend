import { IsEnum, IsObject, IsString, IsOptional } from 'class-validator';
import { ExecutionStatus } from '../entities/execution.entity';

export class UpdateExecutionDto {
  @IsEnum(ExecutionStatus)
  @IsOptional()
  status?: ExecutionStatus;

  @IsObject()
  @IsOptional()
  outputData?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  context?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  error?: string;
}
