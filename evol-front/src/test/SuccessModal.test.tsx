import { render, screen, fireEvent } from '@testing-library/react';
import SuccessModal from '../components/SuccessModal';

describe('SuccessModal Component', () => {
    const mockOnConfirm = jest.fn();

    it('renders the default message', () => {
        render(<SuccessModal onConfirm={mockOnConfirm} />);
        expect(screen.getByText(/acción realizada con éxito/i)).toBeInTheDocument();
    });

    it('renders a custom message', () => {
        render(<SuccessModal onConfirm={mockOnConfirm} message="Test Success" />);
        expect(screen.getByText(/test success/i)).toBeInTheDocument();
    });

    it('calls onConfirm when the button is clicked', () => {
        render(<SuccessModal onConfirm={mockOnConfirm} />);
        fireEvent.click(screen.getByText(/aceptar/i));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
});
