import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header Component', () => {
    it('renders the title and logo correctly', () => {
        render(<Header title="Test Title" />);
        expect(screen.getByText(/test title/i)).toBeInTheDocument();
        expect(screen.getByAltText(/evol logo/i)).toBeInTheDocument();
    });

    it('renders the subtitle when provided', () => {
        render(<Header title="Test Title" subtitle="Test Subtitle" />);
        expect(screen.getByText(/test subtitle/i)).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
        render(<Header title="Test Title" />);
        expect(screen.queryByText(/test subtitle/i)).not.toBeInTheDocument();
    });
});
