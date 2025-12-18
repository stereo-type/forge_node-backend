import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateExecutionDto {
  @IsString()
  workflowId: string;

  @IsObject()
  @IsOptional()
  inputData?: Record<string, unknown>;
}
