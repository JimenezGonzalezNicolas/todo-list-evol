import axios from 'axios';
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTags,
} from '../assets/services/tasksService';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('tasksService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTasks', () => {
        it('fetches tasks with default parameters', async () => {
            const mockResponse = {
                data: {
                    tasks: [
                        { id: 1, title: 'Task 1', completed: false },
                        { id: 2, title: 'Task 2', completed: true },
                    ],
                    total: 2,
                },
            };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const result = await getTasks();

            expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/tasks', {
                params: { limit: 10, offset: 0 },
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('fetches tasks with custom parameters', async () => {
            const mockResponse = { data: { tasks: [], total: 0 } };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const result = await getTasks(5, 10, true, '2025-01-01', '2025-01-02', 'title', 'desc');

            expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/tasks', {
                params: {
                    limit: 5,
                    offset: 10,
                    completed: true,
                    fromDate: '2025-01-01',
                    toDate: '2025-01-02',
                    order: 'title:desc',
                },
            });
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('getTaskById', () => {
        it('fetches a task by ID', async () => {
            const mockResponse = { data: { id: 1, title: 'Task 1' } };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const result = await getTaskById(1);

            expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/tasks/1');
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('createTask', () => {
        it('creates a new task', async () => {
            const mockResponse = { data: { id: 1, title: 'New Task' } };
            const newTask = {
                title: 'New Task',
                description: 'Test Description',
                completed: false,
                tags: ['test'],
                dueDate: '2025-01-01',
            };
            mockedAxios.post.mockResolvedValue(mockResponse);

            const result = await createTask(newTask);

            expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/tasks', newTask);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('updateTask', () => {
        it('updates a task by ID', async () => {
            const mockResponse = { data: { id: 1, title: 'Updated Task' } };
            const updatedTask = { title: 'Updated Task' };
            mockedAxios.put.mockResolvedValue(mockResponse);

            const result = await updateTask(1, updatedTask);

            expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3000/tasks/1', updatedTask);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('deleteTask', () => {
        it('deletes a task by ID', async () => {
            mockedAxios.delete.mockResolvedValue({});

            await deleteTask(1);

            expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3000/tasks/1');
        });
    });

    describe('getTags', () => {
        it('fetches all tags', async () => {
            const mockResponse = { data: ['tag1', 'tag2'] };
            mockedAxios.get.mockResolvedValue(mockResponse);

            const result = await getTags();

            expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/tasks/tags');
            expect(result).toEqual(mockResponse.data);
        });
    });
});
