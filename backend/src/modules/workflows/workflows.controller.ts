import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface CurrentUserPayload {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('workflows')
@ApiBearerAuth('JWT-auth')
@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый workflow' })
  @ApiResponse({ status: 201, description: 'Workflow успешно создан' })
  create(@CurrentUser() user: CurrentUserPayload, @Body() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowsService.create(user.userId, createWorkflowDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список workflow текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Список workflow' })
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.workflowsService.findAll(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить workflow по ID' })
  @ApiResponse({ status: 200, description: 'Workflow найден' })
  @ApiResponse({ status: 404, description: 'Workflow не найден' })
  @ApiResponse({ status: 403, description: 'Нет доступа к workflow' })
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.workflowsService.findOne(id, user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить workflow' })
  @ApiResponse({ status: 200, description: 'Workflow обновлен' })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowsService.update(id, user.userId, updateWorkflowDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить workflow' })
  @ApiResponse({ status: 200, description: 'Workflow удален' })
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.workflowsService.remove(id, user.userId);
  }
}
