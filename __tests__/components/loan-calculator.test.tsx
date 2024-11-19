import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { LoanCalculator } from '@/components/loan-calculator';

describe('LoanCalculator', () => {
  const mockForm = {
    watch: vi.fn(),
    setValue: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockForm.watch.mockReturnValue(1000000);
  });

  it('renders with initial values', () => {
    render(<LoanCalculator form={mockForm as any} />);
    expect(screen.getByText('Loan Calculator')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
  });

  it('updates LTV when preset buttons are clicked', () => {
    render(<LoanCalculator form={mockForm as any} />);
    
    const button75 = screen.getByText('75%');
    fireEvent.click(button75);
    
    expect(mockForm.setValue).toHaveBeenCalledWith(
      'deal.amount',
      750000
    );
  });

  it('updates calculated amount when LTV input changes', () => {
    render(<LoanCalculator form={mockForm as any} />);
    
    const input = screen.getByLabelText('Loan-to-Value (%)');
    fireEvent.change(input, { target: { value: '60' } });
    
    expect(screen.getByText('$600,000')).toBeInTheDocument();
  });
});