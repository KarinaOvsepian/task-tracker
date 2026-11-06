import React, { createContext, useEffect } from 'react';
import { THEME, type Theme, type ThemeContextType } from '../types/theme';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useLocalStorage<Theme>('study_planner_theme', THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
    };

    useEffect(() => {
        const root = document.documentElement;
        if (theme === THEME.DARK) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};