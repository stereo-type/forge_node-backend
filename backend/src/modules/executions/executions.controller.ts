import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExecutionsService } from './executions.service';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { UpdateExecutionDto } from './dto/update-execution.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

interface CurrentUserPayload {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('executions')
@ApiBearerAuth('JWT-auth')
@Controller('executions')
@UseGuards(JwtAuthGuard)
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Post()
  @ApiOperation({ summary: 'Запустить выполнение workflow' })
  @ApiResponse({ status: 201, description: 'Выполнение запущено' })
  @ApiResponse({ status: 400, description: 'Workflow не активен' })
  create(@CurrentUser() user: CurrentUserPayload, @Body() createExecutionDto: CreateExecutionDto) {
    return this.executionsService.create(user.userId, createExecutionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список выполнений' })
  @ApiQuery({ name: 'workflowId', required: false, description: 'Фильтр по workflow ID' })
  @ApiResponse({ status: 200, description: 'Список выполнений' })
  findAll(@CurrentUser() user: CurrentUserPayload, @Query('workflowId') workflowId?: string) {
    return this.executionsService.findAll(user.userId, workflowId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить выполнение по ID с логами' })
  @ApiResponse({ status: 200, description: 'Выполнение найдено' })
  @ApiResponse({ status: 404, description: 'Выполнение не найдено' })
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.executionsService.findOne(id, user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить выполнение' })
  @ApiResponse({ status: 200, description: 'Выполнение обновлено' })
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() updateExecutionDto: UpdateExecutionDto,
  ) {
    return this.executionsService.update(id, user.userId, updateExecutionDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Отменить выполнение' })
  @ApiResponse({ status: 200, description: 'Выполнение отменено' })
  @ApiResponse({ status: 400, description: 'Невозможно отменить завершенное выполнение' })
  cancel(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.executionsService.cancel(id, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить выполнение' })
  @ApiResponse({ status: 200, description: 'Выполнение удалено' })
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.executionsService.remove(id, user.userId);
  }
}
