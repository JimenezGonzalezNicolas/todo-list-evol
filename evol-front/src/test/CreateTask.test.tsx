import { render, screen, fireEvent, act } from '@testing-library/react';
import CreateTask from '../components/NewTask';
import { createTask } from '../assets/services/tasksService';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../assets/services/tasksService');

describe('CreateTask Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form correctly', () => {
        render(
            <BrowserRouter>
                <CreateTask />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/fecha límite/i)).toBeInTheDocument();
    });

    it('validates form fields', async () => {
        render(
            <BrowserRouter>
                <CreateTask />
            </BrowserRouter>
        );

        const submitButton = screen.getByRole('button', { name: /crear tarea/i });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(await screen.findByText(/el título es obligatorio/i)).toBeInTheDocument();
    });

    it('submits the form successfully', async () => {
        (createTask as jest.Mock).mockResolvedValue({});
        render(
            <BrowserRouter>
                <CreateTask />
            </BrowserRouter>
        );

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Test Task' } });
            fireEvent.change(screen.getByLabelText(/descripción/i), { target: { value: 'Test Description' } });
            fireEvent.change(screen.getByLabelText(/fecha límite/i), { target: { value: '2025-01-01' } });
        });

        const submitButton = screen.getByRole('button', { name: /crear tarea/i });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(createTask).toHaveBeenCalledTimes(1);
    });

    it('displays error if createTask fails', async () => {
        (createTask as jest.Mock).mockRejectedValue(new Error('Network Error'));
        render(
            <BrowserRouter>
                <CreateTask />
            </BrowserRouter>
        );

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Test Task' } });
            fireEvent.change(screen.getByLabelText(/descripción/i), { target: { value: 'Test Description' } });
            fireEvent.change(screen.getByLabelText(/fecha límite/i), { target: { value: '2025-01-01' } });
        });

        const submitButton = screen.getByRole('button', { name: /crear tarea/i });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    });
});
