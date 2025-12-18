import { IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateNodeDto {
  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsObject()
  position: { x: number; y: number };

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

class CreateConnectionDto {
  @IsString()
  sourceNodeId: string;

  @IsString()
  targetNodeId: string;

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

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  settings?: Record<string, unknown>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNodeDto)
  @IsOptional()
  nodes?: CreateNodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConnectionDto)
  @IsOptional()
  connections?: CreateConnectionDto[];
}
