export const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}