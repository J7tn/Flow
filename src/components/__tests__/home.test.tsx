import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import Home from '../home';

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('contains navigation elements', () => {
    render(<Home />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
}); 