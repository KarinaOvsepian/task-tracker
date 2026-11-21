import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../hooks/useThemeContext';
import { Toast } from '../components/Toast';

export const AppLayout: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useThemeContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`;

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors">
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        to="/tasks"
                        className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"
                    >
                        <span></span>
                        <span>Study Planner</span>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <NavLink to="/tasks" className={navLinkClass}>
                            Tasks
                        </NavLink>

                        <NavLink to="/profile" className={navLinkClass}>
                            Profile
                        </NavLink>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 ml-1">
                                {user && (
                                    <span className="hidden sm:inline text-xs font-medium text-slate-500 dark:text-slate-400">
                    @{user.username}
                  </span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <NavLink to="/login" className={navLinkClass}>
                                Login
                            </NavLink>
                        )}

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Перемкнути тему"
                            className="ml-1 px-2.5 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            {theme === 'light' ? 'Dark' : 'Light'}
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-3xl mx-auto py-8 px-4">
                <Outlet />
            </main>

            <Toast />
        </div>
    );
};