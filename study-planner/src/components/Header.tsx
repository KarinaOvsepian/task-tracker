import React from 'react';
import { useThemeContext } from '../hooks/useThemeContext';
import { THEME } from '../types/theme';

export const Header: React.FC = () => {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <header className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    Study Planner
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                    Планувальник навчальних завдань
                </p>
            </div>

            <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium flex items-center gap-2"
                title="Переключити тему"
            >
                {theme === THEME.LIGHT ? 'Темна тема' : 'Світла тема'}
            </button>
        </header>
    );
};