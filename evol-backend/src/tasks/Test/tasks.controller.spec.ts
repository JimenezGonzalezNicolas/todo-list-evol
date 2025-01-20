import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTaskService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería devolver una lista de tareas', async () => {
        const tasks = [{ id: 1, title: 'Test Task' }];
        mockTaskService.findAll.mockResolvedValue({ tasks, total: 1 });
      
        const result = await controller.findAll(10, 0);
        expect(result).toEqual({ tasks, total: 1 });
      
        expect(service.findAll).toHaveBeenCalledWith(
          10,        // limit
          0,         // offset
          undefined, // completed
          undefined, // fromDate
          undefined, // toDate
          undefined, // order
        );
      });
  });

  describe('findOne', () => {
    it('debería devolver una tarea por ID', async () => {
      const task = { id: 1, title: 'Test Task' };
      mockTaskService.findOne.mockResolvedValue(task);

      const result = await controller.findOne(1);
      expect(result).toEqual(task);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('debería crear una nueva tarea', async () => {
      const task = { id: 1, title: 'Test Task' };
      mockTaskService.create.mockResolvedValue(task);

      const result = await controller.create({ title: 'Test Task' });
      expect(result).toEqual(task);
      expect(service.create).toHaveBeenCalledWith({ title: 'Test Task' });
    });
  });

  describe('update', () => {
    it('debería actualizar una tarea', async () => {
      const task = { id: 1, title: 'Updated Task' };
      mockTaskService.update.mockResolvedValue(task);

      const result = await controller.update(1, { title: 'Updated Task' });
      expect(result).toEqual(task);
      expect(service.update).toHaveBeenCalledWith(1, { title: 'Updated Task' });
    });
  });

  describe('delete', () => {
    it('debería eliminar una tarea por ID', async () => {
      mockTaskService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);
      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
