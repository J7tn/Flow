import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import WorkflowDesigner from '../WorkflowDesigner';

// Mock the Chat2API service
const mockCreateChatCompletion = vi.fn();
vi.mock('@/lib/chat2api', () => ({
  Chat2APIService: {
    createChatCompletion: mockCreateChatCompletion,
  },
}));

// Mock the API
vi.mock('@/lib/api', () => ({
  flowApi: {
    createFlow: vi.fn(),
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
      <Toaster />
    </BrowserRouter>
  );
};

describe('WorkflowDesigner Goal Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show goal input field', () => {
    renderWithRouter(<WorkflowDesigner />);
    
    expect(screen.getByPlaceholderText(/e.g., Launch a new product/i)).toBeInTheDocument();
    // Remove this line as it's causing issues with multiple empty textareas
  });

  it('should show validation button', () => {
    renderWithRouter(<WorkflowDesigner />);
    
    expect(screen.getByText('Validate Goal')).toBeInTheDocument();
  });

  it('should disable validation button when goal is empty', () => {
    renderWithRouter(<WorkflowDesigner />);
    
    const validateButton = screen.getByText('Validate Goal');
    expect(validateButton).toBeDisabled();
  });

  it('should enable validation button when goal has content', () => {
    renderWithRouter(<WorkflowDesigner />);
    
    const goalInput = screen.getByPlaceholderText(/e.g., Launch a new product/i);
    fireEvent.change(goalInput, { target: { value: 'Test goal' } });
    
    const validateButton = screen.getByText('Validate Goal');
    expect(validateButton).not.toBeDisabled();
  });

  it('should show loading state during validation', async () => {
    mockCreateChatCompletion.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    renderWithRouter(<WorkflowDesigner />);
    
    const goalInput = screen.getByPlaceholderText(/e.g., Launch a new product/i);
    fireEvent.change(goalInput, { target: { value: 'Test goal' } });
    
    const validateButton = screen.getByText('Validate Goal');
    fireEvent.click(validateButton);
    
    expect(screen.getByText('Validating...')).toBeInTheDocument();
  });

  it('should handle gibberish goal validation', async () => {
    mockCreateChatCompletion.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            isValid: false,
            isGibberish: true,
            needsClarity: false,
            suggestions: ['Please provide a meaningful goal'],
            confidence: 0.9
          })
        }
      }]
    });

    renderWithRouter(<WorkflowDesigner />);
    
    const goalInput = screen.getByPlaceholderText(/e.g., Launch a new product/i);
    fireEvent.change(goalInput, { target: { value: 'asdfasdf asdf asdf' } });
    
    const validateButton = screen.getByText('Validate Goal');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      // Use getAllByText to get all elements with this text and check that at least one exists
      const elements = screen.getAllByText(/gibberish or nonsensical/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('should handle needs clarity goal validation', async () => {
    mockCreateChatCompletion.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            isValid: false,
            isGibberish: false,
            needsClarity: true,
            suggestions: ['Add more specific details', 'Include measurable outcomes'],
            confidence: 0.7
          })
        }
      }]
    });

    renderWithRouter(<WorkflowDesigner />);
    
    const goalInput = screen.getByPlaceholderText(/e.g., Launch a new product/i);
    fireEvent.change(goalInput, { target: { value: 'Do something' } });
    
    const validateButton = screen.getByText('Validate Goal');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Add more specific details/i)).toBeInTheDocument();
      expect(screen.getByText(/Include measurable outcomes/i)).toBeInTheDocument();
    });
  });

  it('should handle valid goal validation', async () => {
    mockCreateChatCompletion.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            isValid: true,
            isGibberish: false,
            needsClarity: false,
            suggestions: [],
            confidence: 0.95
          })
        }
      }]
    });

    renderWithRouter(<WorkflowDesigner />);
    
    const goalInput = screen.getByPlaceholderText(/e.g., Launch a new product/i);
    fireEvent.change(goalInput, { target: { value: 'Launch a new product with comprehensive marketing strategy' } });
    
    const validateButton = screen.getByText('Validate Goal');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Great Goal/i)).toBeInTheDocument();
      expect(screen.getByText(/Confidence: 95%/)).toBeInTheDocument();
    });
  });

  it('should disable generate steps button for gibberish goals', async () => {
    mockCreateChatCompletion.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            isValid: false,
            isGibberish: true,
            needsClarity: false,
            suggestions: ['Please provide a meaningful goal'],
            confidence: 0.9
          })
        }
      }]
    });

    renderWithRouter(<WorkflowDesigner />);
    
    const goalInput = screen.getByPlaceholderText(/e.g., Launch a new product/i);
    fireEvent.change(goalInput, { target: { value: 'asdfasdf asdf asdf' } });
    
    const validateButton = screen.getByText('Validate Goal');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      const generateButton = screen.getByText('Generate Steps');
      expect(generateButton).toBeDisabled();
    });
  });

  it('should display tool pricing information', async () => {
    renderWithRouter(<WorkflowDesigner />);
    
    // Wait for tools to be generated
    await waitFor(() => {
      expect(screen.getByText('FREE')).toBeInTheDocument();
    });
    
    // Check for pricing information
    expect(screen.getByText(/FREE - Completely free/)).toBeInTheDocument();
    expect(screen.getByText(/FREEMIUM/)).toBeInTheDocument();
    expect(screen.getByText(/From \$8\/month/)).toBeInTheDocument();
  });

  it('should display new tool categories in filter buttons', async () => {
    renderWithRouter(<WorkflowDesigner />);
    
    // Check for new category buttons in the AI suggestions panel
    // These buttons appear after the goal is validated and steps are generated
    const goalInput = screen.getByPlaceholderText(/e.g., Launch a new product/i);
    fireEvent.change(goalInput, { target: { value: 'Create a mobile game' } });
    
    // Mock successful goal validation
    mockCreateChatCompletion.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            isValid: true,
            isGibberish: false,
            needsClarity: false,
            suggestions: ['Great goal!'],
            confidence: 0.9
          })
        }
      }]
    });
    
    const validateButton = screen.getByText('Validate Goal');
    fireEvent.click(validateButton);
    
    // Wait for validation to complete and steps to be generated
    await waitFor(() => {
      expect(screen.getByText('Generate Steps')).not.toBeDisabled();
    });
    
    const generateButton = screen.getByText('Generate Steps');
    fireEvent.click(generateButton);
    
    // Wait for the AI suggestions panel to appear with category buttons
    await waitFor(() => {
      expect(screen.getByText('creative')).toBeInTheDocument();
      expect(screen.getByText('gaming')).toBeInTheDocument();
      expect(screen.getByText('education')).toBeInTheDocument();
      expect(screen.getByText('health')).toBeInTheDocument();
      expect(screen.getByText('finance')).toBeInTheDocument();
      expect(screen.getByText('social')).toBeInTheDocument();
      expect(screen.getByText('research')).toBeInTheDocument();
    });
  });
}); 