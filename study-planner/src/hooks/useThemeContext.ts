import { useContext } from 'react';
import { ThemeContext } from '../context/theme-context';
import type { ThemeContextType } from '../types/theme';

export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};