# Testing Guide for Your React Web App

This guide covers how to test your React + TypeScript + Vite application using Vitest and React Testing Library.

## 🚀 Quick Start

### Running Tests

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm run test:run

# Run tests with UI (visual test runner)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## 📁 Test Structure

```
src/
├── components/
│   ├── __tests__/          # Component tests
│   │   ├── home.test.tsx
│   │   └── button.test.tsx
│   └── ui/
├── lib/
│   └── __tests__/          # Utility function tests
│       └── utils.test.ts
└── test/
    ├── setup.ts            # Test environment setup
    └── utils.tsx           # Test utilities
```

## 🧪 Types of Tests

### 1. Unit Tests
Test individual functions and utilities in isolation.

**Example: Testing utility functions**
```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('Utils', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });
});
```

### 2. Component Tests
Test React components in isolation using React Testing Library.

**Example: Testing a Button component**
```typescript
// src/components/__tests__/button.test.tsx
import { render, screen, fireEvent } from '../../test/utils';
import { Button } from '../ui/button';

describe('Button Component', () => {
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 3. Integration Tests
Test how components work together.

**Example: Testing form submission**
```typescript
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { Form } from '../Form';

describe('Form Integration', () => {
  it('submits form data correctly', async () => {
    const mockSubmit = vi.fn();
    render(<Form onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
    });
  });
});
```

## 🛠️ Testing Best Practices

### 1. Test User Behavior, Not Implementation
```typescript
// ❌ Don't test implementation details
expect(component.state.isVisible).toBe(true);

// ✅ Test what the user sees
expect(screen.getByText('Hello')).toBeVisible();
```

### 2. Use Semantic Queries
```typescript
// ✅ Prefer these queries (in order of preference)
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByPlaceholderText(/enter email/i);
screen.getByText(/welcome/i);

// ❌ Avoid these unless necessary
screen.getByTestId('submit-button');
screen.getByClassName('btn-primary');
```

### 3. Test Accessibility
```typescript
it('has proper accessibility attributes', () => {
  render(<Button aria-label="Submit form">Submit</Button>);
  
  const button = screen.getByRole('button', { name: /submit form/i });
  expect(button).toBeInTheDocument();
});
```

### 4. Mock External Dependencies
```typescript
// Mock API calls
vi.mock('../api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: 'John' }))
}));

// Mock browser APIs
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## 🔧 Testing Tools

### React Testing Library Queries
- `getByRole` - Find elements by their ARIA role
- `getByLabelText` - Find form elements by their label
- `getByText` - Find elements by their text content
- `getByPlaceholderText` - Find inputs by placeholder
- `getByTestId` - Find elements by test ID (use sparingly)

### User Event Actions
```typescript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

// Simulate user interactions
await user.click(button);
await user.type(input, 'hello world');
await user.keyboard('{Enter}');
await user.hover(element);
```

### Async Testing
```typescript
// Wait for elements to appear
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Wait for elements to disappear
await waitForElementToBeRemoved(() => 
  screen.queryByText('Loading...')
);
```

## 📊 Coverage Reports

Run coverage to see which parts of your code are tested:

```bash
npm run test:coverage
```

This will generate a coverage report showing:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## 🚨 Common Testing Patterns

### Testing Forms
```typescript
it('handles form submission', async () => {
  const user = userEvent.setup();
  const mockSubmit = vi.fn();
  
  render(<ContactForm onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  });
});
```

### Testing API Calls
```typescript
it('fetches and displays data', async () => {
  const mockData = [{ id: 1, title: 'Test Post' }];
  vi.mocked(fetchPosts).mockResolvedValue(mockData);
  
  render(<PostList />);
  
  await waitFor(() => {
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });
});
```

### Testing Error States
```typescript
it('displays error message on API failure', async () => {
  vi.mocked(fetchPosts).mockRejectedValue(new Error('API Error'));
  
  render(<PostList />);
  
  await waitFor(() => {
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

## 🔄 Continuous Integration

Add this to your CI pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://testing-library.com/docs/dom-testing-library/api-accessibility)

## 🎯 Next Steps

1. **Start with component tests** - Test your UI components first
2. **Add integration tests** - Test how components work together
3. **Add E2E tests** - Consider adding Playwright or Cypress for full user journey testing
4. **Set up CI/CD** - Automate your testing pipeline
5. **Monitor coverage** - Aim for 80%+ coverage on critical paths 