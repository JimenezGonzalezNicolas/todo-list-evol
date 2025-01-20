import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDelete from '../components/ConfirmDelete';

describe('ConfirmDelete Component', () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    it('renders the default message', () => {
        render(<ConfirmDelete onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        expect(screen.getByText(/¿estás seguro de que deseas eliminar esto\?/i)).toBeInTheDocument();
    });

    it('renders a custom message', () => {
        render(
            <ConfirmDelete
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
                message="Test Delete Message"
            />
        );
        expect(screen.getByText(/test delete message/i)).toBeInTheDocument();
    });

    it('calls onConfirm when the delete button is clicked', () => {
        render(<ConfirmDelete onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        fireEvent.click(screen.getByText(/eliminar/i));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when the cancel button is clicked', () => {
        render(<ConfirmDelete onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
        fireEvent.click(screen.getByText(/cancelar/i));
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});
