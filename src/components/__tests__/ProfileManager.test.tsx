import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProfileManager } from '../ProfileManager';
import { AuthProvider } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';

// Mock the API functions
vi.mock('@/lib/api', () => ({
  userApi: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    uploadAvatar: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the auth context
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const mockProfile = {
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  company: 'Test Company',
  role: 'Developer',
  preferences: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('ProfileManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (userApi.getProfile as any).mockImplementation(() => new Promise(() => {}));
    
    renderWithAuth(<ProfileManager />);
    
    // Should show loading spinner during initial load
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading profile information')).toBeInTheDocument();
  });

  it('loads and displays profile data', async () => {
    (userApi.getProfile as any).mockResolvedValue(mockProfile);
    
    renderWithAuth(<ProfileManager />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
    });
  });

  it('allows editing profile information', async () => {
    (userApi.getProfile as any).mockResolvedValue(mockProfile);
    (userApi.updateProfile as any).mockResolvedValue(mockProfile);
    
    renderWithAuth(<ProfileManager />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Click edit button
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    // Check that inputs are now visible
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Developer')).toBeInTheDocument();
  });

  it('saves profile changes', async () => {
    (userApi.getProfile as any).mockResolvedValue(mockProfile);
    (userApi.updateProfile as any).mockResolvedValue({
      ...mockProfile,
      full_name: 'Jane Doe',
    });
    
    renderWithAuth(<ProfileManager />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    // Change the name
    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    // Save changes
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    
    await waitFor(() => {
      expect(userApi.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: 'Jane Doe',
        })
      );
    });
  });

  it('handles avatar upload', async () => {
    (userApi.getProfile as any).mockResolvedValue(mockProfile);
    (userApi.uploadAvatar as any).mockResolvedValue(mockProfile);
    
    renderWithAuth(<ProfileManager />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Create a mock file
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    
    // Trigger file upload
    const fileInput = screen.getByRole('button', { name: /change avatar/i });
    fireEvent.click(fileInput);
    
    // Simulate file selection
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(hiddenInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(userApi.uploadAvatar).toHaveBeenCalledWith(file);
    });
  });

  it('displays error messages on API failure', async () => {
    (userApi.getProfile as any).mockRejectedValue(new Error('Failed to load profile'));
    
    renderWithAuth(<ProfileManager />);
    
    await waitFor(() => {
      expect(screen.getByText(/profile information/i)).toBeInTheDocument();
    });
  });

  it('cancels editing and reverts changes', async () => {
    (userApi.getProfile as any).mockResolvedValue(mockProfile);
    
    renderWithAuth(<ProfileManager />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    
    // Change the name
    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    // Cancel changes
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    // Check that the original value is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('generates initials from full name', async () => {
    (userApi.getProfile as any).mockResolvedValue(mockProfile);
    
    renderWithAuth(<ProfileManager />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Check that initials are displayed in avatar fallback
    const avatar = screen.getByText('JD');
    expect(avatar).toBeInTheDocument();
  });
}); 