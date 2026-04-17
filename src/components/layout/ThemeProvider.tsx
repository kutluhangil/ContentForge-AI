'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * ThemeProvider for "Obsidian Luxury" dark theme.
 * Currently the app is dark-only. This provider exists to support
 * a future light mode toggle without refactoring every component.
 */

type Theme = 'dark';

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark' });

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // App is dark-only for now. The CSS variables in globals.css
  // define the Obsidian Luxury palette on :root.
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}
