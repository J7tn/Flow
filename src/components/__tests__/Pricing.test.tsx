import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Pricing } from '../Pricing';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Pricing', () => {
  it('should render pricing plans', () => {
    renderWithRouter(<Pricing />);
    
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('should show monthly pricing by default', () => {
    renderWithRouter(<Pricing />);
    
    expect(screen.getByText('$9')).toBeInTheDocument();
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('per month')).toBeInTheDocument();
  });

  it('should toggle to yearly pricing when clicked', () => {
    renderWithRouter(<Pricing />);
    
    const yearlyToggle = screen.getByRole('button');
    fireEvent.click(yearlyToggle);
    
    expect(screen.getByText('$90')).toBeInTheDocument();
    expect(screen.getByText('$290')).toBeInTheDocument();
    expect(screen.getByText('per year')).toBeInTheDocument();
    expect(screen.getByText('Save up to 17%')).toBeInTheDocument();
  });

  it('should show savings badges for yearly plans', () => {
    renderWithRouter(<Pricing />);
    
    const yearlyToggle = screen.getByRole('button');
    fireEvent.click(yearlyToggle);
    
    expect(screen.getByText('Save $18/year')).toBeInTheDocument();
    expect(screen.getByText('Save $58/year')).toBeInTheDocument();
  });

  it('should display plan features', () => {
    renderWithRouter(<Pricing />);
    
    expect(screen.getByText('Unlimited projects')).toBeInTheDocument();
    expect(screen.getByText('Up to 20 team members')).toBeInTheDocument();
    expect(screen.getByText('Unlimited team members')).toBeInTheDocument();
  });

  it('should show most popular badge on Pro plan', () => {
    renderWithRouter(<Pricing />);
    
    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('should display FAQ section', () => {
    renderWithRouter(<Pricing />);
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText("What's the difference between the plans?")).toBeInTheDocument();
    expect(screen.getByText('Is there a discount for yearly billing?')).toBeInTheDocument();
  });
}); 