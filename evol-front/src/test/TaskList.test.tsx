import { render, screen, fireEvent } from '@testing-library/react';
import TasksList from '../components/TaskList';
import { getTasks, getTags, deleteTask } from '../assets/services/tasksService';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../assets/services/tasksService');

describe('TasksList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getTasks as jest.Mock).mockResolvedValue({
            tasks: [
                { id: 1, title: 'Task 1', description: 'Description 1', completed: false, tags: ['tag1'], dueDate: '2025-01-01T00:00:00.000Z' },
                { id: 2, title: 'Task 2', description: 'Description 2', completed: true, tags: ['tag2'], dueDate: '2025-01-02T00:00:00.000Z' },
            ],
            total: 2,
        });
        (getTags as jest.Mock).mockResolvedValue(['tag1', 'tag2']);
    });

    it('renders task list correctly', async () => {
        render(<BrowserRouter>
            <TasksList />
        </BrowserRouter>);

        const task1 = await screen.findByText(/task 1/i);
        const task2 = await screen.findByText(/task 2/i);

        expect(task1).toBeInTheDocument();
        expect(task2).toBeInTheDocument();
    });

    it('filters tasks by search term', async () => {
        render(<BrowserRouter>
            <TasksList />
        </BrowserRouter>);

        const searchInput = screen.getByPlaceholderText(/buscar por nombre/i);
        fireEvent.change(searchInput, { target: { value: 'Task 1' } });

        expect(await screen.findByText(/task 1/i)).toBeInTheDocument();
        expect(screen.queryByText(/task 2/i)).not.toBeInTheDocument();
    });

    it('handles delete task action', async () => {
        (deleteTask as jest.Mock).mockResolvedValue({});
        render(<BrowserRouter>
            <TasksList />
        </BrowserRouter>);

        const deleteButton = await screen.findAllByAltText(/eliminar/i);
        fireEvent.click(deleteButton[0]);

        expect(deleteTask).toHaveBeenCalledWith(1);
    });

    it('displays no tasks message when list is empty', async () => {
        (getTasks as jest.Mock).mockResolvedValue({ tasks: [], total: 0 });
        render(
            <BrowserRouter>
                <TasksList />
            </BrowserRouter>
        );

        expect(await screen.findByText(/no hay tareas disponibles/i)).toBeInTheDocument();
    });

    it('filters tasks by tags', async () => {
        render(<BrowserRouter>
            <TasksList />
        </BrowserRouter>);

        const tagFilter = await screen.findByText(/tag1/i);
        fireEvent.click(tagFilter);

        expect(await screen.findByText(/task 1/i)).toBeInTheDocument();
        expect(screen.queryByText(/task 2/i)).not.toBeInTheDocument();
    });
});