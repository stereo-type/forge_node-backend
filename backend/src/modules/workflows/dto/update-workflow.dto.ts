import { IsString, IsOptional, IsObject, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkflowStatus } from '../entities/workflow.entity';

class UpdateNodeDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  position?: { x: number; y: number };

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;

  @IsArray()
  @IsOptional()
  inputs?: Array<{
    name: string;
    type: string;
    required?: boolean;
    defaultValue?: unknown;
  }>;

  @IsArray()
  @IsOptional()
  outputs?: Array<{
    name: string;
    type: string;
  }>;
}

class UpdateConnectionDto {
  @IsString()
  @IsOptional()
  sourceNodeId?: string;

  @IsString()
  @IsOptional()
  targetNodeId?: string;

  @IsString()
  @IsOptional()
  sourceOutput?: string;

  @IsString()
  @IsOptional()
  targetInput?: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;
}

export class UpdateWorkflowDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  settings?: Record<string, unknown>;

  @IsEnum(WorkflowStatus)
  @IsOptional()
  status?: WorkflowStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateNodeDto)
  @IsOptional()
  nodes?: UpdateNodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateConnectionDto)
  @IsOptional()
  connections?: UpdateConnectionDto[];
}
