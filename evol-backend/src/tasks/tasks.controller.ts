import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, Query, ParseIntPipe, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './DTO/create-task.dto';
import { UpdateTaskDto } from './DTO/update-task.dto';
import { Task } from '../models/task.model';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @ApiOperation({ summary: 'Obtener todas las tareas' })
    @ApiResponse({ status: 200, description: 'Lista de tareas devuelta con éxito.', type: [Task] })
    @ApiQuery({ name: 'completed', required: false, example: true, description: 'Filtrar por estado de la tarea (true/false)' })
    @ApiQuery({ name: 'fromDate', required: false, example: '2025-01-01', description: 'Filtrar tareas desde esta fecha' })
    @ApiQuery({ name: 'toDate', required: false, example: '2025-01-31', description: 'Filtrar tareas hasta esta fecha' })
    @ApiQuery({ name: 'order', required: false, example: 'createdAt:desc', description: 'Ordenar tareas (campo:orden)' })
    @Get()
    async findAll(
        @Query('limit') limit = 10,
        @Query('offset') offset = 0,
        @Query('completed') completed?: boolean,
        @Query('fromDate') fromDate?: string,
        @Query('toDate') toDate?: string,
        @Query('order') order?: string,
    ): Promise<{ tasks: Task[]; total: number }> {
        return this.tasksService.findAll(+limit, +offset, completed, fromDate ? new Date(fromDate) : undefined, toDate ? new Date(toDate) : undefined, order);
    }

    @ApiOperation({ summary: 'Obtener todas las etiquetas únicas' })
    @ApiResponse({ status: 200, description: 'Lista de etiquetas únicas.', type: [String] })
    @Get('/tags')
    async findAllTags(): Promise<string[]> {
        console.log('Llamada al endpoint /tasks/tags');
        return this.tasksService.findAllTags();
    }

    @ApiOperation({ summary: 'Obtener una tarea por ID' })
    @ApiResponse({ status: 200, description: 'Tarea encontrada.', type: Task })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        console.log('ID recibido:', id);
        return this.tasksService.findOne(id);
    }

    @ApiOperation({ summary: 'Crear una nueva tarea' })
    @ApiResponse({ status: 201, description: 'Tarea creada con éxito.', type: Task })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.create(createTaskDto);
    }


    @ApiOperation({ summary: 'Actualizar una tarea existente' })
    @ApiResponse({ status: 200, description: 'Tarea actualizada con éxito.', type: Task })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
        return this.tasksService.update(id, updateTaskDto);
    }

    @ApiOperation({ summary: 'Eliminar una tarea por ID' })
    @ApiResponse({ status: 204, description: 'Tarea eliminada con éxito.' })
    @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        await this.tasksService.delete(id);
    }
}
