import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { getModelToken } from '@nestjs/sequelize';
import { Task } from '../../models/task.model';

const mockTaskModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
};

describe('TasksService', () => {
    let service: TasksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getModelToken(Task),
                    useValue: mockTaskModel,
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debería estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('debería devolver una lista de tareas con paginación', async () => {
            const tasks = [{ id: 1, title: 'Test Task' }];
            mockTaskModel.findAndCountAll.mockResolvedValue({ rows: tasks, count: 1 });
          
            const result = await service.findAll(10, 0);
          
            expect(result).toEqual({ tasks, total: 1 });
            expect(mockTaskModel.findAndCountAll).toHaveBeenCalledWith({
              limit: 10,
              offset: 0,
              where: {},
              order: undefined,
            });
          });
    });

    describe('findOne', () => {
        it('debería devolver una tarea por ID', async () => {
            const task = { id: 1, title: 'Test Task' };
            mockTaskModel.findByPk.mockResolvedValue(task);

            const result = await service.findOne(1);
            expect(result).toEqual(task);
            expect(mockTaskModel.findByPk).toHaveBeenCalledWith(1);
        });

        it('debería lanzar NotFoundException si la tarea no existe', async () => {
            mockTaskModel.findByPk.mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow('Task with ID 1 not found');
        });
    });

    describe('create', () => {
        it('debería crear una tarea', async () => {
            const task = { id: 1, title: 'Test Task' };
            mockTaskModel.create.mockResolvedValue(task);

            const result = await service.create(task);
            expect(result).toEqual(task);
            expect(mockTaskModel.create).toHaveBeenCalledWith(task);
        });
    });

    describe('delete', () => {
        it('debería eliminar una tarea existente', async () => {
            const task = { id: 1, destroy: jest.fn() };
            mockTaskModel.findByPk.mockResolvedValue(task);

            await service.delete(1);
            expect(task.destroy).toHaveBeenCalled();
        });

        it('debería lanzar NotFoundException si la tarea no existe', async () => {
            mockTaskModel.findByPk.mockResolvedValue(null);

            await expect(service.delete(1)).rejects.toThrow('Task with ID 1 not found');
        });
    });
});
