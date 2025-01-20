import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../models/task.model';
import { UpdateTaskDto } from './DTO/update-task.dto';
import { Op } from 'sequelize';
import { TaskNotFoundException } from '../common/exceptions/task-not-found.exception';
import { CreateTaskDto } from './DTO/create-task.dto';

@Injectable()
export class TasksService {
    constructor(@InjectModel(Task) private readonly taskModel: typeof Task) { }

    // Obtener lista de tareas
    async findAll(
        limit: number,
        offset: number,
        completed?: boolean,
        fromDate?: Date,
        toDate?: Date,
        order?: string
    ): Promise<{ tasks: Task[]; total: number }> {
        if (limit < 1 || offset < 0) {
            throw new HttpException(
                'Los parámetros "limit" y "offset" deben ser positivos.',
                HttpStatus.BAD_REQUEST
            );
        }

        try {
            const where: any = {};
            if (completed !== undefined) where.completed = completed;

            if (fromDate || toDate) {
                where.dueDate = {};
                if (fromDate) where.dueDate[Op.gte] = fromDate;
                if (toDate) where.dueDate[Op.lte] = toDate;
            }

            let parsedOrder: [string, 'ASC' | 'DESC'][] | undefined;
            if (order) {
              const [field, direction] = order.split(':');
              if (!field || !['asc', 'desc'].includes(direction?.toLowerCase())) {
                throw new HttpException(
                  'El formato del parámetro "order" es inválido. Use "campo:orden" donde orden es "asc" o "desc".',
                  HttpStatus.BAD_REQUEST,
                );
              }
              parsedOrder = [[field, direction.toUpperCase() as 'ASC' | 'DESC']];
            }

            const { rows: tasks, count: total } = await this.taskModel.findAndCountAll({
                where,
                limit,
                offset,
                order: parsedOrder,
            });

            return { tasks, total };
        } catch (error) {
            console.error('Error en findAll:', {
              message: error.message,
              stack: error.stack,
              details: error
            });
            throw new HttpException('Error al obtener las tareas.', HttpStatus.INTERNAL_SERVER_ERROR);
          }
    }


    // Obtener las etiquetas
    async findAllTags(): Promise<string[]> {
        try {
            const tasks = await this.taskModel.findAll({
                attributes: ['tags'],
                where: {
                    tags: {
                        [Op.not]: null
                    }
                },
                raw: true
            });

            if (!tasks || !tasks.length) {
                return [];
            }

            const allTags = tasks
                .filter(task => task.tags && Array.isArray(task.tags))
                .flatMap(task => task.tags)
                .filter(tag => tag && typeof tag === 'string');

            return [...new Set(allTags)];
        } catch (error) {
            console.error('Error al obtener etiquetas:', error);
            throw new HttpException(
                'Error al obtener las etiquetas',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    // Ver tarea por ID
    async findOne(id: number): Promise<Task> {
        const task = await this.taskModel.findByPk(id);
        if (!task) {
            throw new TaskNotFoundException(id);
        }
        return task;
    }

    // Crear una tarea
    async create(data: CreateTaskDto): Promise<Task> {
        try {
            const taskData: Partial<Task> = {
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            };

            return await this.taskModel.create(taskData);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new HttpException(
                    'Ya existe una tarea registrada con este nombre.',
                    HttpStatus.BAD_REQUEST,
                );
            } else if (error.name === 'SequelizeValidationError') {
                throw new HttpException(
                    'Los datos proporcionados no son válidos.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw new HttpException('Error al crear la tarea.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Actualizar la tarea que ya existe
    async update(id: number, data: UpdateTaskDto): Promise<Task> {
        // Verificar si los datos poseen modificación
        if (Object.keys(data).length === 0) {
            throw new HttpException(
                'No se enviaron datos para actualizar.',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            // Si existe la tarea, la modifica
            const task = await this.findOne(id);
            return await task.update(data);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Error al actualizar la tarea.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    // Eliminar la tarea
    async delete(id: number): Promise<void> {
        const task = await this.findOne(id);

        try {
            await task.destroy();
        } catch (error) {
            throw new HttpException(
                `Error al eliminar la tarea con ID ${id}.`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
