import { render, screen, fireEvent, act } from '@testing-library/react';
import UpdateTask from '../components/UpdateTask';
import { getTaskById, updateTask } from '../assets/services/tasksService';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../assets/services/tasksService');

const mockOnClose = jest.fn();
const mockOnUpdate = jest.fn();

describe('UpdateTask Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getTaskById as jest.Mock).mockResolvedValue({
            id: 1,
            title: 'Test Task',
            description: 'This is a test task',
            dueDate: '2025-01-01T00:00:00.000Z',
            completed: false,
            tags: ['test', 'react'],
        });
    });

    it('renders loading state initially', async () => {
        render(
            <BrowserRouter>
                <UpdateTask taskId={1} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </BrowserRouter>
        );
        expect(screen.getByText(/cargando datos/i)).toBeInTheDocument();
    });

    it('renders the task data when loaded', async () => {
        render(
            <BrowserRouter>
                <UpdateTask taskId={1} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </BrowserRouter>
        );

        const titleInput = await screen.findByDisplayValue('Test Task');
        expect(titleInput).toBeInTheDocument();
        expect(screen.getByDisplayValue('This is a test task')).toBeInTheDocument();
    });

    it('calls onUpdate and onClose on successful form submission', async () => {
        (updateTask as jest.Mock).mockResolvedValue({});
        render(
            <BrowserRouter>
                <UpdateTask taskId={1} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </BrowserRouter>
        );

        const submitButton = await screen.findByRole('button', { name: /actualizar/i });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(updateTask).toHaveBeenCalledTimes(1);
        expect(mockOnUpdate).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('displays error message on update failure', async () => {
        (updateTask as jest.Mock).mockRejectedValue(new Error('Update failed'));
        render(
            <BrowserRouter>
                <UpdateTask taskId={1} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </BrowserRouter>
        );

        const submitButton = await screen.findByRole('button', { name: /actualizar/i });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(await screen.findByText(/update failed/i)).toBeInTheDocument();
    });

    it('closes without updating if cancel is clicked', async () => {
        render(
            <BrowserRouter>
                <UpdateTask taskId={1} onClose={mockOnClose} onUpdate={mockOnUpdate} />
            </BrowserRouter>
        );

        const cancelButton = await screen.findByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(updateTask).not.toHaveBeenCalled();
    });
});
