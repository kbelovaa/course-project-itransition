import React from 'react';

export const ThemeContext = React.createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState('light');

  const triggerTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: triggerTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
