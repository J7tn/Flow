import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { useScrollToTop } from '../useScrollToTop';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

describe('useScrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should scroll to top when location changes', () => {
    const mockLocation = { pathname: '/test' };
    (useLocation as any).mockReturnValue(mockLocation);

    renderHook(() => useScrollToTop());

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  it('should scroll to top when pathname changes', () => {
    const mockLocation1 = { pathname: '/initial' };
    const mockLocation2 = { pathname: '/changed' };
    
    (useLocation as any).mockReturnValue(mockLocation1);
    const { rerender } = renderHook(() => useScrollToTop());

    // Clear the initial call
    mockScrollTo.mockClear();

    // Change location
    (useLocation as any).mockReturnValue(mockLocation2);
    rerender();

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });
}); 