import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type AccentColor = 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange' | 'pink' | 'indigo';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to safely get item from localStorage
const getStoredTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('flow-theme');
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      return saved as Theme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  return 'auto';
};

// Helper function to safely get accent color from localStorage
const getStoredAccentColor = (): AccentColor => {
  try {
    const saved = localStorage.getItem('flow-accent-color');
    if (saved && ['blue', 'green', 'purple', 'red', 'yellow', 'orange', 'pink', 'indigo'].includes(saved)) {
      return saved as AccentColor;
    }
  } catch (error) {
    console.warn('Failed to read accent color from localStorage:', error);
  }
  return 'blue';
};

// Helper function to safely save to localStorage
const saveToStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [accentColor, setAccentColor] = useState<AccentColor>(getStoredAccentColor);
  const [isDark, setIsDark] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'auto') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      setIsDark(theme === 'dark');
      root.classList.add(theme);
    }

    // Save to localStorage with custom key to avoid conflicts
    saveToStorage('flow-theme', theme);
  }, [theme]);

  // Apply accent color
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing accent color classes
    root.classList.remove(
      'accent-blue', 'accent-green', 'accent-purple', 'accent-red', 
      'accent-yellow', 'accent-orange', 'accent-pink', 'accent-indigo'
    );
    
    // Add new accent color class
    root.classList.add(`accent-${accentColor}`);
    
    // Save to localStorage with custom key to avoid conflicts
    saveToStorage('flow-accent-color', accentColor);
  }, [accentColor]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Enhanced setTheme function with validation
  const handleSetTheme = (newTheme: Theme) => {
    if (['light', 'dark', 'auto'].includes(newTheme)) {
      setTheme(newTheme);
    } else {
      console.warn('Invalid theme value:', newTheme);
    }
  };

  // Enhanced setAccentColor function with validation
  const handleSetAccentColor = (newColor: AccentColor) => {
    if (['blue', 'green', 'purple', 'red', 'yellow', 'orange', 'pink', 'indigo'].includes(newColor)) {
      setAccentColor(newColor);
    } else {
      console.warn('Invalid accent color value:', newColor);
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme: handleSetTheme,
    accentColor,
    setAccentColor: handleSetAccentColor,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 